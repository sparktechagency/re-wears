import { JwtPayload } from "jsonwebtoken";
import { IMessage } from "./message.interface";
import { Message } from "./message.model";
import { sendNotifications } from "../../../helpers/notificationsHelper";
import { MakeAnOffer } from "../makeanoffer/makeanoffer.model";

const sendMessageToDB = async (
  payload: IMessage & { type: "offer" | "text"; product: string },
  user: JwtPayload
): Promise<IMessage> => {
  let messageData: any = {
    text: payload?.text || "",
    image: payload.image,
    type: payload?.type || "text",
    chatId: payload?.chatId,
    receiver: payload?.receiver,
    sender: user.id,
  };

  if (payload?.type === "offer") {
    const offer = await MakeAnOffer.create({
      user: user.id,
      price: payload.price,
      product: payload.product,
    });
    messageData.offerId = offer._id;
  }

  const message = await Message.create(messageData);
  // Emit socket message
  //@ts-ignore
  const io = global.io;
  if (io) {
    const eventName = `getMessages::${payload.receiver}`;
    io.emit(eventName, message);
  } else {
    console.log("❌ global.io not available");
  }

  // Send notification
  await sendNotifications({
    receiver: payload.receiver,
    sender: user.id,
    message: messageData.text,
    type: messageData.type,
    chatId: payload.chatId,
    offerId: messageData.offerId,
  });

  return message;
};

const getMessageFromDB = async (id: any): Promise<IMessage[]> => {
  const messages = await Message.find({ chatId: id })
    .sort({ createdAt: 1 })
    .populate({
      path: "offer",
      select: "product offerStatus",
      populate: {
        path: "product",
        select: "name price",
      },
    });
  return messages;
};

export const MessageService = { sendMessageToDB, getMessageFromDB };
