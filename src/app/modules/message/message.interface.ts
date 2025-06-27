import { Model, Types } from "mongoose";
type MessageType = "text" | "offer";
export type IMessage = {
  id?: string;
  chatId: Types.ObjectId;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  text?: string;
  image?: string;
  price?: number;
  offer: Types.ObjectId;
  type: {
    type: String,
    enum: ["text", "offer"],
    default: "text",
  },
};

export type MessageModel = Model<IMessage, Record<string, unknown>>;
