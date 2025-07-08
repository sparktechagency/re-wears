import { model, Schema } from 'mongoose';
import { INotification, NotificationModel } from './notification.interface';

const notificationSchema = new Schema<INotification, NotificationModel>(
    {
        receiver: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        referenceId: {
            type: String,
            required: false
        },
        read: {
            type: Boolean,
            default: false
        },
        notificationType: {
            type: String,
            enum: ['wishlist', 'createProduct', 'offer', "editProduct"],
            required: false
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: false
        },
        wishlist: {
            type: Schema.Types.ObjectId,
            ref: 'Wishlist',
            required: false
        }
    },
    {
        timestamps: true
    }
);

export const Notification = model<INotification, NotificationModel>(
    'Notification',
    notificationSchema
);
