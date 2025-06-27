import { JwtPayload } from "jsonwebtoken";
import { IMakeAnOffer } from "./makeanoffer.interface";
import { MakeAnOffer } from "./makeanoffer.model";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import QueryBuilder from "../../builder/queryBuilder";
import { sendNotifications } from "../../../helpers/notificationsHelper";
import { Message } from "../message/message.model";
import { ChatService } from "../chat/chat.service";

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
  payload: { product: string; price: number; receiver: string }
) => {
  const { product, price, receiver } = payload;
  const participants = [user.id, receiver];
  const chat = await ChatService.createChatToDB(participants);
  if (!chat._id) {
    await chat.save();
  }

  const chatId = chat._id.toString();
  const offer = new MakeAnOffer({
    user: user.id,
    product,
    price,
  });

  await offer.save();
  const message = await Message.create({
    text: `Offered $${price} for product`,
    type: "offer",
    chatId,
    receiver,
    sender: user.id,
    offer: offer._id,
  });
  // @ts-ignore
  const io = global.io;
  if (io) {
    const event = `getMessages::${receiver}`;
    io.emit(event, message);
  }
  await sendNotifications({
    receiver,
    sender: user.id,
    message: `Offered $${price} for product`,
    type: "offer",
    chatId,
    offerId: offer._id,
  });

  return message;
};



export const MakeAnOfferServices = {
  createMakeAnOfferIntoDB,
  getAllOfferFromDB,
  sendOfferUsingMessage
};
