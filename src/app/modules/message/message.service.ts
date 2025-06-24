import { JwtPayload } from "jsonwebtoken";
import { IMessage } from "./message.interface";
import { Message } from "./message.model";
import { sendNotifications } from "../../../helpers/notificationsHelper";

const sendMessageToDB = async (
  payload: any,
  user: JwtPayload
): Promise<IMessage> => {
  // save to DB
  const response = await Message.create({ ...payload, sender: user.id });

  //@ts-ignore
  const io = global.io;
  if (io) {
    io.emit(`getMessages::${payload?.receiver}`, response);
  }
  await sendNotifications({
    receiver: payload?.receiver,
    sender: user.id,
    message: payload?.text,
    type: "message",
    chatId: payload?.chatId,
  });

  return response;
};

const getMessageFromDB = async (id: any): Promise<IMessage[]> => {
  const messages = await Message.find({ chatId: id }).sort({ createdAt: -1 });
  return messages;
};

export const MessageService = { sendMessageToDB, getMessageFromDB };
