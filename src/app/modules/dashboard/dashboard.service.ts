// total user ,Active Users,Total Products,Total Revenue
import { Product } from "../product/product.model";
import { User } from "../user/user.model";

const getTotalUserProductRevenueFromDB = async () => {
    const totalUser = await User.countDocuments();
    const activeUser = await User.countDocuments({ isVerified: true });
    const totalProduct = await Product.countDocuments();
    const totalRevenue = 0

    return { totalUser, activeUser, totalProduct, totalRevenue };
};




// user grouth base on weakly, monthly and yearly
const getUserGrowthFromDB = async (period: 'daily' | 'weakly' | 'yearly') => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let match: any = { createdAt: { $gte: start } };
    let group: any = { _id: "$createdAt", count: { $sum: 1 } };
    let project: any = { _id: 0, count: 1, date: "$_id" };

    switch (period) {
        case 'daily':
            match = { ...match, createdAt: { $gte: start.setDate(start.getDate() - 7) } };
            group = { ...group, _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } };
            break;
        case 'weakly':
            match = { ...match, createdAt: { $gte: start.setDate(start.getDate() - 7 * 4) } };
            group = { ...group, _id: { $dateToString: { format: "%Y-W%V", date: "$createdAt" } } };
            break;
        case 'yearly':
            match = { ...match, createdAt: { $gte: new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()) } };
            group = { ...group, _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } } };
            break;
    }

    const result = await User.aggregate([
        { $match: match },
        { $group: group },
        { $project: project },
        { $sort: { date: -1 } },
    ]);

    return result;
};


// Logged In, product Items, Sold Items

const getLoggedInProductSoldItemsFromDB      = async (period: 'daily' | 'weakly' | 'monthly') => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let match: any = { createdAt: { $gte: start } };

    switch (period) {
        case 'daily':
            match = { ...match, createdAt: { $gte: start.setDate(start.getDate() - 1) } };
            break;
        case 'weakly':
            match = { ...match, createdAt: { $gte: start.setDate(start.getDate() - 7) } };
            break;
        case 'monthly':
            match = { ...match, createdAt: { $gte: start.setDate(start.getDate() - 30) } };
            break;
    }

    const [loggedIn, productItems, soldItems] = await Promise.all([
        User.countDocuments({ isVacation: true, ...match }),
        Product.countDocuments(match),
        Product.countDocuments({ status: "Sold", ...match }),
    ]);

    return { loggedIn, productItems, soldItems };
};

// Trending Categories
const trendingCategoriesFromDB = async()=>{
    const trendingCategories = await Product.aggregate([
        {
            $group: {
                _id: "$category",
                count: { $sum: 1 },
            },
        },
        {
            $sort: { count: -1 },
        },
    ]);
    return trendingCategories;
}

// export function 
export const dashboardService = {
    getTotalUserProductRevenueFromDB,
    getUserGrowthFromDB,
    getLoggedInProductSoldItemsFromDB,
    trendingCategoriesFromDB
}