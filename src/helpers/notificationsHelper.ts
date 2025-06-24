import { INotification } from "../app/modules/notification/notification.interface";
import { Notification } from "../app/modules/notification/notification.model";


export const sendNotifications = async (data: any): Promise<INotification> => {
  console.log("notification data", data);
  const result = await Notification.create(data);

  //@ts-ignore
  const io = global.io;

  if (io) {
    const eventName = `get-notification::${data?.receiver}`;
    console.log("🚀 Emitting Socket Event:", eventName);
    io.emit(eventName, result);
  } else {
    console.log("❌ socketIo not initialized");
  }


  return result;
}