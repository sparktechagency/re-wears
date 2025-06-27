// total user ,Active Users,Total Products,Total Revenue
import { getISOWeekNumber } from "../../utils/getISOWeekNumber";
import { Product } from "../product/product.model";
import { User } from "../user/user.model";

const getTotalUserProductRevenueFromDB = async () => {
    const totalUser = await User.countDocuments();
    const activeUser = await User.countDocuments({ isVerified: true });
    const totalProduct = await Product.countDocuments();
    const totalRevenue = 0

    return { totalUser, activeUser, totalProduct, totalRevenue };
};




// user growth base on weakly, monthly and yearly
const getUserGrowthFromDB = async (period: 'daily' | 'weakly' | 'yearly') => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let match: any = {};
    let group: any = {};
    let format = '';
    let dateList: string[] = [];

    const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];

    if (period === 'daily') {
        const days = 7;
        const from = new Date(start);
        from.setDate(from.getDate() - days + 1);
        match = { createdAt: { $gte: from } };
        format = "%Y-%m-%d";

        for (let i = 0; i < days; i++) {
            const date = new Date(from);
            date.setDate(date.getDate() + i);
            dateList.push(date.toISOString().slice(0, 10)); // e.g. "2025-06-19"
        }

    } else if (period === 'weakly') {
        const weeks = 4;
        const from = new Date(start);
        from.setDate(from.getDate() - (weeks * 7));
        match = { createdAt: { $gte: from } };
        format = "%G-W%V"; // ISO year and week number

        dateList.length = 0;
        for (let i = weeks - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - (i * 7));
            const weekNum = getISOWeekNumber(date);
            dateList.push(weekNum.toString());
        }

    } else if (period === 'yearly') {
        const from = new Date(now.getFullYear(), 0, 1);
        match = { createdAt: { $gte: from } };
        format = "%m"; // month number "01", "02", ...

        for (let i = 0; i < 12; i++) {
            dateList.push(monthNames[i]);
        }
    }

    group = {
        _id: { $dateToString: { format, date: "$createdAt" } },
        count: { $sum: 1 },
    };

    const result = await User.aggregate([
        { $match: match },
        { $group: group },
        { $project: { _id: 0, date: "$_id", count: 1 } },
        { $sort: { date: 1 } },
    ]);

    const resultMap: Record<string, number> = {};

    if (period === 'daily') {
        // Map YYYY-MM-DD string to count
        result.forEach(item => {
            resultMap[item.date] = item.count;
        });

        return dateList.map(dateStr => ({
            date: dayNamesShort[new Date(dateStr).getDay()],
            count: resultMap[dateStr] || 0,
        }));

    } else if (period === 'weakly') {
        // Map "2025-W22" => "22" week number to count
        result.forEach(item => {
            const weekNum = item.date.split("-W")[1];
            resultMap[weekNum] = item.count;
        });

        return dateList.map(weekNum => ({
            date: weekNum,
            count: resultMap[weekNum] || 0,
        }));

    } else if (period === 'yearly') {
        // Map "01" => "January"
        result.forEach(item => {
            const monthIndex = parseInt(item.date, 10) - 1;
            const monthName = monthNames[monthIndex];
            resultMap[monthName] = item.count;
        });

        return dateList.map(monthName => ({
            date: monthName,
            count: resultMap[monthName] || 0,
        }));
    }

    return [];
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