import { model, Schema } from "mongoose";
import { GENDER, USER_ROLES } from "../../../enums/user";
import { IUser, UserModal } from "./user.interface";
import bcrypt from "bcrypt";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import config from "../../../config";

const userSchema = new Schema<IUser, UserModal>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    provider: {
      type: String,
      required: false,
    },
    providerId: {
      type: String,
      required: false,
    },

    password: {
      type: String,
      required: true,
      select: 0,
      minlength: 8,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      required: true,
    },
    image: {
      type: String,
      required: false,
      default:
        "https://res.cloudinary.com/dzo4husae/image/upload/v1733459922/zfyfbvwgfgshmahyvfyk.png",
    },
    location: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      enum: Object.values(GENDER),
      required: false,
    },
    dob: {
      type: Date,
      required: false,
    },
    isVacation: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    lastSeenAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    authentication: {
      type: {
        isResetPassword: {
          type: Boolean,
          default: false,
        },
        oneTimeCode: {
          type: Number,
          default: null,
        },
        expireAt: {
          type: Date,
          default: null,
        },
      },
      select: 0,
    },

    appId: {
      type: String,
      required: false,
    },
    facebookId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);


//exist user check
userSchema.statics.isExistUserById = async (id: string) => {
  const isExist = await User.findById(id);
  return isExist;
};

userSchema.statics.isExistUserByEmail = async (email: string) => {
  const isExist = await User.findOne({ email });
  return isExist;
};

//account check
userSchema.statics.isAccountCreated = async (id: string) => {
  const isUserExist: any = await User.findById(id);
  return isUserExist.accountInformation.status;
};

//is match password
userSchema.statics.isMatchPassword = async (password: string, hashPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashPassword);
};

//check user
userSchema.pre('save', async function (next) {
  //check user
  const isExist = await User.findOne({ email: this.email });
  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already exist!');
  }

  //password hash
  this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt_rounds));
  next();
});
export const User = model<IUser, UserModal>("User", userSchema)