import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from './user.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import config from '../../../config';

// register user
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { ...userData } = req.body;
  const result = await UserService.createUserToDB(userData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Your account has been successfully created. Verify Your Email By OTP. Check your email',
    data:{}
  })
});

// register admin
const createAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { ...userData } = req.body;
  const result = await UserService.createAdminToDB(userData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Admin created successfully',
    data: result
  });
});

//update profile
const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    let image;
    if (req.files && "image" in req.files && req.files.image[0]) {
      image = `/image/${req.files.image[0].filename}`;
    }

    const data = {
      image,
      ...req.body,
    };
    const result = await UserService.updateProfileToDB(user!, data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Profile updated successfully",
      data: result,
    });
  }
);

// update user role
const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.updateUserRole(req.params.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User role updated successfully",
    data: result,
  });
})

// delete user
const deleteSingleUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.deleteUserFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User deleted successfully",
    data: result,
  });
})

// toggle user blocking
const toggleUserBlocking = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.toggleUserBlockingIntoDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User status updated successfully",
    data: result,
  });
})

// retrieved user profile
const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserService.getUserProfileFromDB(user!);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Profile data retrieved successfully",
    data: result,
  });
})

// retrieved all users
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Users data retrieved successfully",
    pagination: result.meta,
    data: result.result,
  });
});


const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  console.log(config.google.clientSecret)
  const result = await UserService.getSingleUserFromDB(id)
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User data retrieved successfully",
    data: result,
  });
})


const updateUserNickName = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await UserService.updateUserNickNameBaseOnIdFromDB(id, req.body)
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User data updated successfully",
    data: result,
  });
})


const loginWithGoogle = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.handleLoginWithGoogle()
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User data login successfully",
    data: result,
  });
})

const loginWithFacebook = catchAsync(async (req: Request, res: Response) => {

  const result = await UserService.handleLoginWithFacebook(req.user!)

  return res.redirect(`${config.url.frontend_url}?token=${result}`)


})

const facebookCallback = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User data updated successfully",
  });
})

export const UserController = {
  createUser,
  createAdmin,
  updateProfile,
  updateUserRole,
  deleteSingleUser,
  toggleUserBlocking,
  getUserProfile,
  getAllUsers,
  getSingleUser,
  updateUserNickName,
  loginWithGoogle,
  loginWithFacebook
};