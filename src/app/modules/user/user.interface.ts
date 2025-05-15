import { Model } from "mongoose";
import { GENDER, USER_ROLES } from "../../../enums/user";

interface IStripeAccountInfo {
  status: string;
  stripeAccountId: string;
  externalAccountId: string;
  currency: string;
}

interface IAuthenticationProps {
  isResetPassword: boolean;
  oneTimeCode: number;
  expireAt: Date;
}

export type IUser = {
  firtName: string;
  lastName: string;
  email: string;
  password: string;
  role: USER_ROLES;
  image: string;
  location: string;
  gender: GENDER;
  bod: Date;
  isVacation: boolean;
  isVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  authentication?: IAuthenticationProps;
  accountInformation?: IStripeAccountInfo;
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isAccountCreated(id: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
