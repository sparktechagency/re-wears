import { ICms } from "./cms.interface";
import { Cms } from "./cms.model";

// create or update cms
const createOrUpdateCms = async (type: string, payload: Partial<ICms>) => {
  const result = await Cms.findOneAndUpdate(
    { type },
    {
      $set: {
        ...payload,
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

  return result;
};

// get cms
const getCms = async (type: string) => {
  const result = await Cms.findOne({ type });

  // check if cms exists
  if (!result) {
    throw new Error(`Cms with type ${type} not found`);
  }
  return result;
}

export const CmsServices = { createOrUpdateCms, getCms };
