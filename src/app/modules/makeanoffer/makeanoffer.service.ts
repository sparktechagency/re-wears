import { JwtPayload } from "jsonwebtoken";
import { IMakeAnOffer } from "./makeanoffer.interface";
import { MakeAnOffer } from "./makeanoffer.model";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import QueryBuilder from "../../builder/queryBuilder";
import { sendNotifications } from "../../../helpers/notificationsHelper";
import { Message } from "../message/message.model";

const createMakeAnOfferIntoDB = async (
  payload: IMakeAnOffer,
  user: JwtPayload
) => {
  const result = await MakeAnOffer.create({
    ...payload,
    user: user.id,
  });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Can't create offer");
  }
  await sendNotifications({

  });
  return result;
};

const getAllOfferFromDB = async (
  user: JwtPayload,
  query: Record<string, any>
) => {
  const queryBuilder = new QueryBuilder(
    MakeAnOffer.find({
      user: user.id,
    }).lean(),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await queryBuilder.modelQuery;
  const paginationInfo = await queryBuilder.getPaginationInfo();

  if (!result) {
    return {
      data: [],
      pagination: paginationInfo,
    };
  }
  return {
    data: result,
    pagination: paginationInfo,
  };
};
// send offer to user
const sendOfferUsingMessage = async (
  user: JwtPayload,
  payload: IMakeAnOffer & { receiver: string, chatId: string },
) => {
  const offer = await MakeAnOffer.create({
    user: user.id,
    price: payload.price,
    product: payload.product,
  });

  const messageData = {
    text: `Offered $${payload.price} for product`,
    type: "offer",
    chatId: payload.chatId,
    receiver: payload.receiver,
    sender: user.id,
    offer: offer._id,
  };
  const message = await Message.create(messageData);
  // @ts-ignore
  const io = global.io;
  if (io) {
    const event = `getMessages::${payload.receiver}`;
    console.log("📡 Emitting socket:", event);
    io.emit(event, message);
  }
  await sendNotifications({
    receiver: payload.receiver,
    sender: user.id,
    message: messageData.text,
    type: "offer",
    chatId: payload.chatId,
    offerId: offer._id,
  });

  return message;
};

export const MakeAnOfferServices = {
  createMakeAnOfferIntoDB,
  getAllOfferFromDB,
  sendOfferUsingMessage
};
