import { Schema, model } from "mongoose";
import { ISupport, SupportModel } from "./support.interface";
import { SupportPriority, SupportStatus } from "./support.constants";

const supportSchema = new Schema<ISupport, SupportModel>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  subject: { type: String, required: false },
  message: { type: String, required: false },
  priority: {
    type: String,
    enum: Object.values(SupportPriority),
    required: true,
    default: SupportPriority.MEDIUM,
  },
  status: {
    type: String,
    enum: Object.values(SupportStatus),
    required: true,
    default: SupportStatus.OPEN,
  },
});

export const Support = model<ISupport, SupportModel>("Support", supportSchema);
