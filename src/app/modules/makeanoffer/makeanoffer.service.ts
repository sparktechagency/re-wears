import { JwtPayload } from "jsonwebtoken";
import { IMakeAnOffer } from "./makeanoffer.interface";
import { MakeAnOffer } from "./makeanoffer.model";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import QueryBuilder from "../../builder/queryBuilder";
import { sendNotifications } from "../../../helpers/notificationsHelper";
import { Message } from "../message/message.model";
import { ChatService } from "../chat/chat.service";
import { Product } from "../product/product.model";

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
  const productDetails = await Product.findById(payload.product);
  const notificationPayload = await sendNotifications({
    title: "New offer",
    body: `You have a new offer from ${user.name}`,
    receiver: productDetails?.user,
    notificationType: "offer",
    productId: productDetails?._id,
  });
  // @ts-ignore
  const io = global.io;
  if (io) {
    io.emit(`notifications::${productDetails?.user}`, notificationPayload);
  }
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
    offerStatus: "pending",
    receiver,
    sender: user.id,
    offer: offer._id,
    price
  });
  // @ts-ignore
  const io = global.io;
  if (io) {
    const event = `notifications::${receiver}`;
    io.emit(event, message);
  }
  await sendNotifications({
    receiver,
    sender: user.id,
    message: `Offered $${price} for product`,
    productId: product,
    notificationType: "offer",
    chatId,
    offerId: offer._id,
  });

  return message;
};


const offerUpdateFromDB = async (user: JwtPayload, payload: IMakeAnOffer, id: string) => {
  const result = await MakeAnOffer.findByIdAndUpdate(
    { user: user.id, _id: id },
    payload,
    { new: true }
  );

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Can't update offer");
  }
  return result;
}



export const MakeAnOfferServices = {
  createMakeAnOfferIntoDB,
  getAllOfferFromDB,
  sendOfferUsingMessage,
  offerUpdateFromDB
};
