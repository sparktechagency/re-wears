import { Category } from "../category/category.model";
import { Product } from "../product/product.model";

const getAllProductBaseOnAllCategory = async (filters: {
    category?: string;
    subCategory?: string;
    childSubCategory?: string;
}) => {
    const query: any = {};

    // 🟡 Apply category filter if given
    if (filters.category && filters.category !== "All") {
        query["category.category"] = filters.category;
    }

    // 🔵 Only apply subCategory if it's NOT "All"
    if (filters.subCategory && filters.subCategory !== "All") {
        query["category.subCategory"] = filters.subCategory;
    }

    // 🔴 Only apply childSubCategory if it's NOT "All"
    if (filters.childSubCategory && filters.childSubCategory !== "All") {
        query["category.childSubCategory"] = filters.childSubCategory;
    }

    const products = await Product.find(query)
        .populate("category.category")
        .populate("category.subCategory")
        .populate("category.childSubCategory")
        .populate("brand size material colors user");

    return products;

}

const getAllProductBaseOnCategory = async () => {
    const categories = await Category.aggregate([
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
                    }
                ],
            },
        }
    ]);

    // 🛠 Post-process to add All and merge childSubCategories
    const processed = categories.map(category => {
        // All childSubCategories from all subCategories
        const allChildSubs = category?.subCategories?.flatMap((sub: any) => sub?.childSubCategories);

        // Add All at the start
        const subCategoriesWithAll = [
            {
                _id: null,
                name: "All",
                icon: null,
                childSubCategories: allChildSubs
            },
            ...category.subCategories
        ];

        return {
            _id: category._id,
            name: category.name,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
            subCategories: subCategoriesWithAll
        };
    });

    return processed;
};

export const navService = {
    getAllProductBaseOnAllCategory,
    getAllProductBaseOnCategory
}