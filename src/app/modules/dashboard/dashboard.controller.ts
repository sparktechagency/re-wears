import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { dashboardService } from "./dashboard.service";
import sendResponse from "../../../shared/sendResponse";

const getTotalUserProductRevenueFromDB = catchAsync(async (req: Request, res: Response) => {
    const result = await dashboardService.getTotalUserProductRevenueFromDB();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Total user product revenue fetched successfully",
        data: result,
    });
});

const getUserGrowth = catchAsync(async (req: Request, res: Response) => {
    const result = await dashboardService.getUserGrowthFromDB(req.query.period as 'daily' | 'weakly' | 'yearly');
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User growth fetched successfully",
        data: result,
    });
});

const getLoggedInProductSoldItems = catchAsync(async (req: Request, res: Response) => {
    const result = await dashboardService.getLoggedInProductSoldItemsFromDB(req.query.period as 'daily' | 'weakly' | 'monthly');
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Logged in product sold items fetched successfully",
        data: result,
    });
});


const getTrendingCategories = catchAsync(async (req: Request, res: Response) => {
    const result = await dashboardService.trendingCategoriesFromDB();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Trending categories fetched successfully",
        data: result,
    });
});


const getActiveUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await dashboardService.totalActiveUserDataInDB(req.query.period as 'daily' | 'weekly' | 'monthly');
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Active users fetched successfully",
        data: result,
    });
});

// getActiveUserAndListedItemAndSoldItemsAndSoldItemsAndCategoryItems

const getActiveUserAndListedItemsAndSoldItemsAndCategoryItems = catchAsync(async (req: Request, res: Response) => {
    const result = await dashboardService.getActiveUserAndListedItemAndSoldItemsAndSoldItemsAndCategoryItemsFromDB(req.query.period as 'daily' | 'weekly' | 'monthly');
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Active user and listed items and sold items and category items fetched successfully",
        data: result,
    });
});

// tranding category
const getTrendingCategorie = catchAsync(async (req: Request, res: Response) => {
    const result = await dashboardService.getTrendingCategoriesFromDB(
        req.query.period as "daily" | "weekly" | "monthly"
    );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Trending categories fetched successfully",
        data: result,
    });
});


// export function
export const dashboardController = {
    getTotalUserProductRevenueFromDB,
    getUserGrowth,
    getLoggedInProductSoldItems,
    getTrendingCategories,
    getActiveUsers,
    getActiveUserAndListedItemsAndSoldItemsAndCategoryItems,
    getTrendingCategorie
}