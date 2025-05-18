import { Model } from "mongoose";
import { SupportPriority, SupportStatus } from "./support.constants";

export type ISupport = {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message?: string;
  priority: SupportPriority;
  status: SupportStatus;
};

export type SupportModel = Model<ISupport>;
