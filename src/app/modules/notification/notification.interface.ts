import { Model, Types } from 'mongoose';

export type INotification = { 
    receiver?: Types.ObjectId;
    read: boolean;
    referenceId?: string;
    screen?: "RESERVATION" | "CHAT";
    type?: "ADMIN";
};

export type NotificationModel = Model<INotification>;