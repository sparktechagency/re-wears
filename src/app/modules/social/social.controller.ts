import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { SocialServices } from "./social.service";
import sendResponse from "../../../shared/sendResponse";

const createSocial = catchAsync(async (req: Request, res: Response) => {
  const socialData = req.body;
  const result = await SocialServices.createSocialToDB(socialData);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Social created successfully',
    data: result,
  });
});


const getAllSocial = catchAsync(async (req: Request, res: Response) => {
  const result = await SocialServices.getAllSocialFromDB();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Socials retrieved successfully',
    data: result,
  });
});

export const SocialController = {
  createSocial,
  getAllSocial,
};