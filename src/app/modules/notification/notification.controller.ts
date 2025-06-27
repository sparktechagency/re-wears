import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { NotificationService } from './notification.service';

const getNotificationFromDB = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await NotificationService.getNotificationFromDB(user!);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Notifications Retrieved Successfully',
        data: result,
    });
}
);

const adminNotificationFromDB = catchAsync(async (req: Request, res: Response) => {
    const result = await NotificationService.adminNotificationFromDB();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Notifications Retrieved Successfully',
        data: result
    });
});

const readNotification = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await NotificationService.readNotificationToDB(user!);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Notification Read Successfully',
        data: result
    });
});

// const adminReadNotification = catchAsync( async (req: Request, res: Response) => {
//     const result = await NotificationService.adminReadNotificationToDB();

//     sendResponse(res, {
//         statusCode: StatusCodes.OK,
//         success: true,
//         message: 'Notification Read Successfully',
//         data: result
//     });
// });

// create admin notification
const createAdminNotification = catchAsync(async (req: Request, res: Response) => {
    const result = await NotificationService.createAdminNotification(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Notification Created Successfully',
        data: result
    });
})


const getAllNotification = catchAsync(async (req: Request, res: Response) => {
    const result = await NotificationService.getAllNotificationFromDB(req.user!);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Notifications Retrieved Successfully',
        data: result
    });
})

const updateNotification = catchAsync(async (req: Request, res: Response) => {
    const { notificationId } = req.params;
    // @ts-ignore
    const userId = req.user?.id;

    const result = await NotificationService.updateNotificationFromDB(
        notificationId,
        userId.toString()
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Notification marked as read',
        data: result,
    });
});



export const NotificationController = {
    adminNotificationFromDB,
    getNotificationFromDB,
    readNotification,
    // adminReadNotification,
    createAdminNotification,
    getAllNotification,
    updateNotification
};
