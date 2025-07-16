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


// * This function retrieves all social media links from the database

const getAllSocialFromDB = async (): Promise<ISocial[] | null> => {
  const result = await Social.find();
  if (!result) {
    return [];
  }
  return result;
};

const updateSocialToDB = async (
  id: string,
  payload: Partial<ISocial>,
): Promise<ISocial | null> => {
  const result = await Social.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Failed to update social media links',
    );
  }
  return result;
};


export const SocialServices = {
  createSocialToDB,
    getAllSocialFromDB,
    updateSocialToDB,
};
