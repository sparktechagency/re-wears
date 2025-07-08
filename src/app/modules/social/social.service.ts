
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { ISocial } from "./social.interface";
import { Social } from "./social.model";


import { StatusCodes } from 'http-status-codes';
import { ISocial } from './social.interface';
import { Social } from './social.model';
import ApiError from '../../../errors/ApiErrors';

// * This function creates a new social media link in the database

const createSocialToDB = async (payload: ISocial): Promise<ISocial | null> => {
  const result = await Social.findOneAndUpdate(
    {}, // No filter condition = assuming there's only one document
    payload,
    {

      new: true, // return the updated document
      upsert: true, // create the document if it doesn't exist

      new: true,         // return the updated document
      upsert: true,      // create the document if it doesn't exist

      setDefaultsOnInsert: true, // apply default values if creating
    }
  );

  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,

      'Failed to create or update social media links',

    );
  }

  return result;
};

const getAllSocialFromDB = async (): Promise<ISocial | null> => {
  const result = await Social.findOne({});
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Social media links not found");
  }
  return result;
};




// * This function retrieves all social media links from the database



export const SocialServices = {
  createSocialToDB,
    getAllSocialFromDB,
};
