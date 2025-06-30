import { JwtPayload } from 'jsonwebtoken';
import { INotification } from './notification.interface';
import { Notification } from './notification.model';
import { Types } from 'mongoose';
import ApiError from '../../../errors/ApiErrors';
import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/queryBuilder';

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


const getAllNotificationFromDB = async (
    user: JwtPayload,
    query: Record<string, any>
): Promise<{ result: INotification[]; meta: any }> => {

    const queryBuilder = new QueryBuilder(
        Notification.find({ receiver: user?.id }),
        query
    ).populate(
        ['sender', 'productId'],
        {
            sender: 'firstName lastName userName image',
            productId: 'name price',
        }
    );


    queryBuilder
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await queryBuilder.modelQuery.exec();
    const meta = await queryBuilder.getPaginationInfo();

    if (!result) {
        return { result: [], meta };
    }

    return { result, meta };
};





const updateNotificationFromDB = async (notificationId: string, userId: string) => {
    // Use findOneAndUpdate instead of findByIdAndUpdate
    const notification = await Notification.findByIdAndUpdate(
        {
            _id: new Types.ObjectId(notificationId),
            receiver: new Types.ObjectId(userId),
        },
        { read: true },
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
