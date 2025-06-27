import { JwtPayload } from 'jsonwebtoken';
import { INotification } from './notification.interface';
import { Notification } from './notification.model';
import { Types } from 'mongoose';
import ApiError from '../../../errors/ApiErrors';
import { StatusCodes } from 'http-status-codes';

// get notifications
const getNotificationFromDB = async (user: JwtPayload): Promise<INotification> => {

    const result = await Notification.find({ receiver: user.id }).populate({
        path: 'sender',
        select: 'name profile',
    });

    const unreadCount = await Notification.countDocuments({
        receiver: user.id,
        read: false,
    });

    const data: any = {
        result,
        unreadCount
    };

    return data;
};

// read notifications only for user
const readNotificationToDB = async (user: JwtPayload): Promise<INotification | undefined> => {

    const result: any = await Notification.updateMany(
        { receiver: user.id, read: false },
        { $set: { read: true } }
    );
    return result;
};

// get notifications for admin
const adminNotificationFromDB = async () => {
    // const result = await Notification.find({ type: 'ADMIN' });
    // return result;
};

// read notifications only for admin
// const adminReadNotificationToDB = async (): Promise<INotification | null> => {
//     const result: any = await Notification.updateMany(
//         { type: 'ADMIN', read: false },
//         { $set: { read: true } },
//         { new: true }
//     );
//     return result;
// };


// ------------------ ADMIN NOTIFICATIONS ------------------

// create admin notification
const createAdminNotification = async (payload: any): Promise<INotification | null> => {
    const result = await Notification.create(payload);
    if (!result) {
        throw new Error('Failed to create notification');
    }
    return result;
};


const getAllNotificationFromDB = async (user: JwtPayload): Promise<INotification[]> => {
    const userId = user.id
    const result = await Notification.find({ receiver: userId }).populate({
        path: 'sender',
        select: 'name profile',
    });
    if (!result) {
        return []
    }
    return result;
};



const updateNotificationFromDB = async (notificationId: string, userId: string) => {
    // Use findOneAndUpdate instead of findByIdAndUpdate
    const notification = await Notification.findOneAndUpdate(
        {
            _id: new Types.ObjectId(notificationId),
            receiver: new Types.ObjectId(userId),
        },
        { isRead: true },
        { new: true, runValidators: true }
    );

    if (!notification) {
        throw new ApiError(
            StatusCodes.FORBIDDEN,
            'Notification not found or does not belong to you'
        );
    }

    return notification;
};



export const NotificationService = {
    adminNotificationFromDB,
    getNotificationFromDB,
    readNotificationToDB,
    // adminReadNotificationToDB,
    createAdminNotification,
    getAllNotificationFromDB,
    updateNotificationFromDB
};
