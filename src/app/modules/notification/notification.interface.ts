import { Model, Types } from 'mongoose';

export type INotification = {
    receiver?: Types.ObjectId;
    read: boolean;
    referenceId?: string;
    notificationType?: "wishlist" | "createProduct" | "offer" | "editProduct";
    sender?: Types.ObjectId;
    productId?: Types.ObjectId;
    wishlist?: Types.ObjectId;
    offer?: Types.ObjectId;
    chat?: Types.ObjectId;
};

export type NotificationModel = Model<INotification>;