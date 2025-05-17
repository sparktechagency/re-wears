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

export const CmsServices = { createOrUpdateCms };
