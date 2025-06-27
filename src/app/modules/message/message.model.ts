import { Schema, model } from 'mongoose';
import { IMessage, MessageModel } from './message.interface';

const messageSchema = new Schema<IMessage, MessageModel>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Chat',
    },
    type: {
      type: String,
      enum: ['text', 'offer']
    },
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    receiver: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    price: {
      type: Number,
      required: false
    },
    text: {
      type: String,
      required: false
    },
    offer: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'MakeAnOffer',
    },
    image: {
      type: String,
      required: false
    },
  },
  {
    timestamps: true,
  }
);

export const Message = model<IMessage, MessageModel>('Message', messageSchema);
