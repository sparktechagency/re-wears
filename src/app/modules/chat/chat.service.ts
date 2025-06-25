import { Types } from 'mongoose';
import { IMessage } from '../message/message.interface';
import { Message } from '../message/message.model';
import { IChat } from './chat.interface';
import { Chat } from './chat.model';

const createChatToDB = async (participants: (string | Types.ObjectId)[]) => {
    const existingChat = await Chat.findOne({
        participants: { $all: participants },
    });

    if (existingChat) {
        return existingChat; // returns saved doc with _id
    }

    // Chat.create() saves to DB and returns document with _id
    const chat = await Chat.create({ participants });
    return chat;
};


const getChatFromDB = async (user: any, search: string): Promise<IChat[]> => {

    const chats: any = await Chat.find({ participants: { $in: [user.id] } })
        .populate({
            path: 'participants',
            select: '_id firstName lastName image',
            match: {
                _id: { $ne: user.id }, // Exclude user.id in the populated participants
                ...(search && { name: { $regex: search, $options: 'i' } }), // Apply $regex only if search is valid
            }
        })
        .select('participants status');

    // Filter out chats where no participants match the search (empty participants)
    const filteredChats = chats?.filter(
        (chat: any) => chat?.participants?.length > 0
    );

    //Use Promise.all to handle the asynchronous operations inside the map
    const chatList: IChat[] = await Promise.all(
        filteredChats?.map(async (chat: any) => {
            const data = chat?.toObject();

            const lastMessage: IMessage | null = await Message.findOne({ chatId: chat?._id })
                .sort({ createdAt: -1 })
                .select('text offer createdAt sender');

            return {
                ...data,
                lastMessage: lastMessage || null,
            };
        })
    );

    return chatList;
};

export const ChatService = { createChatToDB, getChatFromDB };