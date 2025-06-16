import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { ICategory } from "./category.interface";
import { Category } from "./category.model";

const createCategoryToDB = async (payload: ICategory) => {
  const { name } = payload;
  const isExistName = await Category.findOne({ name: name });
  if (isExistName) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Category already exist");
  }
  const createCategory: any = await Category.create(payload);

  return createCategory;
};

const getCategoriesFromDB = async () => {
  const result = await Category.aggregate([
    {
      $lookup: {
        from: "subcategories",
        localField: "_id",
        foreignField: "category",
        as: "subCategories",
        pipeline: [
          {
            $lookup: {
              from: "childsubcategories",
              localField: "_id",
              foreignField: "subCategory",
              as: "childSubCategories",
            },
          },
          {
            $project: {
              name: 1,
              icon: 1,
              childSubCategories: {
                $map: {
                  input: "$childSubCategories",
                  as: "childSubCategory",
                  in: {
                    name: "$$childSubCategory.name",
                    _id: "$$childSubCategory._id",
                  },
                },
              },
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$subCategories",
        preserveNullAndEmptyArrays: true,
      },
    },
    // {
    //   $lookup: {
    //     from: "childsubcategories",
    //     let: { subCatId: "$subCategories._id" },
    //     pipeline: [
    //       {
    //         $match: {
    //           $expr: { $eq: ["$subCategory", "$$subCatId"] },
    //         },
    //       },
    //       {
    //         $project: {
    //           _id: 1,
    //           name: 1,
    //         },
    //       },
    //     ],
    //     as: "subCategories.childSubCategories",
    //   },
    // },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        subCategories: {
          $push: "$subCategories",
        },
      },
    },
  ]);

  return result;
};

const updateCategoryToDB = async (id: string, payload: ICategory) => {
  const isExistCategory: any = await Category.findById(id);

  if (!isExistCategory) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Category doesn't exist");
  }
  const updateCategory = await Category.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateCategory;
};

const deleteCategoryToDB = async (id: string): Promise<ICategory | null> => {
  const deleteCategory = await Category.findByIdAndDelete(id);
  if (!deleteCategory) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Category doesn't exist");
  }
  return deleteCategory;
};

const getSingleCategoryFromDB = async (
  id: string
): Promise<ICategory | null> => {
  const result = await Category.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Category doesn't exist");
  }
  return result;
};

export const CategoryService = {
  createCategoryToDB,
  getCategoriesFromDB,
  updateCategoryToDB,
  deleteCategoryToDB,
  getSingleCategoryFromDB,
};
