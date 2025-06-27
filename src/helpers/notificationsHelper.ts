import { INotification } from "../app/modules/notification/notification.interface";
import { Notification } from "../app/modules/notification/notification.model";


export const sendNotifications = async (data: any): Promise<INotification> => {
  const result = await Notification.create(data);

  //@ts-ignore
  const io = global.io;

  if (io) {
    const eventName = `get-notification::${data?.receiver}`;
    io.emit(eventName, result);
  } else {
    console.log("❌ socketIo not initialized");
  }


  return result;
}