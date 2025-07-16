import { Request, Response } from 'express';
import { SocialServices } from './social.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

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

//
const updateSocial = catchAsync(async (req: Request, res: Response) => {
  const socialId = req.params.id;
  const socialData = req.body;
  const result = await SocialServices.updateSocialToDB(socialId, socialData);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Social updated successfully',
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
  updateSocial,
};
