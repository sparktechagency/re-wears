import { Model, Types } from 'mongoose';

export type INotification = { 
    receiver?: Types.ObjectId;
    read: boolean;
    referenceId?: string;
};

export type NotificationModel = Model<INotification>;