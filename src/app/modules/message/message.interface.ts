import { Model, Types } from "mongoose";

export type IMessage = {
  id?: string;
  chatId: Types.ObjectId;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  text?: string;
  image?: string;
};

export type MessageModel = Model<IMessage, Record<string, unknown>>;
