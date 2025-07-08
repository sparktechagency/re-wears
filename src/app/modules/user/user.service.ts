import { USER_ROLES } from "../../../enums/user";
import { IUser } from "./user.interface";
import { JwtPayload } from "jsonwebtoken";
import { User } from "./user.model";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import generateOTP from "../../../util/generateOTP";
import { emailTemplate } from "../../../shared/emailTemplate";
import { emailHelper } from "../../../helpers/emailHelper";
import unlinkFile from "../../../shared/unlinkFile";
import QueryBuilder from "../../builder/queryBuilder";
import generateSequentialId from "../../utils/idGenerator";
import { Review } from "../review/review.model";
import { UserFollower } from "../follower/follower.model";
import axios from "axios";

const createAdminToDB = async (payload: any): Promise<IUser> => {
  // check admin is exist or not;
  const isExistAdmin = await User.findOne({ email: payload.email });
  if (isExistAdmin) {
    throw new ApiError(StatusCodes.CONFLICT, "This Email already exist");
  }
  // generate siquence id
  const id = await generateSequentialId(User, "id");
  payload.id = id;

  // create admin to db
  const createAdmin = await User.create(payload);
  if (!createAdmin) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create Admin");
  } else {
    await User.findByIdAndUpdate(
      { _id: createAdmin?._id },
      { isVerified: true },
      { new: true }
    );
  }

  return createAdmin;
};

const createUserToDB = async (payload: Partial<IUser>): Promise<IUser> => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new ApiError(StatusCodes.CONFLICT, "This Email already exist");
  }
  const createUser = await User.create(payload);
  if (!createUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create user");
  }

  //send email
  const otp = generateOTP();
  const values = {
    name: createUser.firstName,
    otp: otp,
    email: createUser.email!,
  };

  const createAccountTemplate = emailTemplate.createAccount(values);
  emailHelper.sendEmail(createAccountTemplate);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60000),
  };

  await User.findOneAndUpdate(
    { _id: createUser._id },
    { $set: { authentication } }
  );

  return createUser;
};

// update profile
const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (payload.image) {
    unlinkFile(isExistUser.image);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return updateDoc;
};

// update user role
const updateUserRole = async (id: string, payload: { role: USER_ROLES }) => {
  const isExistUser: any = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  const result = await User.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

// block/unblock user
const toggleUserBlockingIntoDB = async (id: string) => {
  const isExistUser: any = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  const result = await User.findByIdAndUpdate(
    id,
    { isBlocked: !isExistUser.isBlocked },
    { new: true }
  );

  return result;
};

// delete user
const deleteUserFromDB = async (id: string) => {
  const isExistUser: any = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  return result;
};

// get profile data
const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser: any = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  await User.findByIdAndUpdate(id, { lastSeenAt: new Date() });
  return isExistUser;
};

// get all users data
const getAllUsers = async (
  query: Record<string, unknown>
): Promise<IUser[]> => {
  const searchableFields = ["id", "firstName", "lastName", "email", "code"];

  const userQuery = new QueryBuilder<IUser>(
    User.find({ isDeleted: false, role: { $ne: USER_ROLES.SUPER_ADMIN } }),
    query
  )
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to get users");
  }
  return result;
};

// TODO: need to return user follower how much user he follwing | user-name | follower | following | rating | reviews
const getSingleUserFromDB = async (id: string) => {
  const user = await User.findById(id).lean();
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "No user found");
  }

  // --- Followers: people who follow this user
  const followerDoc = await UserFollower.findOne({ user: id }).lean();
  const followers = followerDoc?.follower || [];
  const followersCount = followers?.length;

  // --- Following: people this user follows (find all where follower array includes this user)
  const followingDocs = await UserFollower.find({ follower: id }).lean();
  const following = followingDocs?.map((doc) => doc.user);
  const followingCount = following?.length;

  // --- Review Count
  const reviewCount = await Review.countDocuments({
    $or: [{ customer: id }, { user: id }],
  });

  // --- Average Rating from customer reviews
  const customerReviews = await Review.find({ user: id }).lean();
  const validRatings = customerReviews
    .map((r) => r.rating)
    .filter((r) => typeof r === "number" && !isNaN(r));

  const customerAvgRating = validRatings.length
    ? parseFloat(
        (
          validRatings.reduce((acc, curr) => acc + curr, 0) /
          validRatings.length
        ).toFixed(2)
      )
    : 0;

  return {
    followingCount,
    followersCount,
    customerAvgRating,
    reviewCount,
    user,
  };
};

const updateUserNickNameBaseOnIdFromDB = async (id: string, payload: IUser) => {
  const isExistUser: any = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  if (payload.userName) {
    const existingUser = await User.findOne({
      userName: payload.userName,
      _id: { $ne: id },
    });
    if (existingUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Username already taken!");
    }
  }
  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to update user");
  }
  return result;
};

//login with google

const handleLoginWithGoogle = async () => {};

// login with apple
const handleLoginWithFacebook = async (payload: any) => {
  const url = `https://graph.facebook.com/${payload.userID}?fields=id,name,email,picture&access_token=${payload.accessToken}`;
  const response = await axios.get(url);
  const user: any = response.data;
  let existingUser = await User.findOne({ facebookId: user.id });
  if (!existingUser) {
    // If the user doesn't exist, create a new user
    existingUser = await User.create({
      facebookId: payload.user.id,
      name: payload.user.name,
      email: payload.user.email,
      profilePicture: user.picture.data.url,
    });
  }
  return existingUser;
};

const updateEnterTime = async (userId: string): Promise<void> => {
  await User.findByIdAndUpdate(userId, { enterTime: new Date() });
};

const updateLeaveTime = async (userId: string): Promise<void> => {
  await User.findByIdAndUpdate(userId, { leaveTime: new Date() });
};

export const UserService = {
  createUserToDB,
  createAdminToDB,
  updateProfileToDB,
  updateUserRole,
  toggleUserBlockingIntoDB,
  deleteUserFromDB,
  getUserProfileFromDB,
  getAllUsers,
  getSingleUserFromDB,
  updateUserNickNameBaseOnIdFromDB,
  handleLoginWithGoogle,
  handleLoginWithFacebook,
  updateEnterTime,
  updateLeaveTime,
};
