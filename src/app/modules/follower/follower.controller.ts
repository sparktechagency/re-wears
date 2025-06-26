import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { followerService } from "./follower.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const followUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    // @ts-ignore
    const followerId = req?.user?.id;

    const result = await followerService.followOrUnfollowUser(userId, followerId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message:
            result.status === "followed"
                ? "User followed successfully"
                : "User unfollowed successfully",
        data: result.data,
    });
});


// TODO: get all followers of a user
const getAllFollowerBaseOnUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const result = await followerService.getUserFollowerBaseOnUserIdFromDB(userId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All followers fetched successfully",
        data: result,
    });
})


export const followerController = {
    followUser,
    getAllFollowerBaseOnUser
}