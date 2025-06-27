import { Model } from "mongoose";
import { GENDER, USER_ROLES } from "../../../enums/user";


interface IAuthenticationProps {
  isResetPassword: boolean;
  oneTimeCode: number;
  expireAt: Date;
}

export type IUser = {
  _id: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: USER_ROLES;
  image: string;
  location: string;
  gender: GENDER;
  dob: Date;
  isVacation: boolean;
  isVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  authentication?: IAuthenticationProps;
  userName?: string;
  appId?: string;
  provider?: string;
  lastSeenAt?: Date;
  providerId?: string;
  facebookId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isAccountCreated(id: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
