import { User } from "./types";

export type MessageResponse = {
  success: boolean;
  message: string;
};
export type UserResponse = {
  success: boolean;
  user: User;
};

export type DeleteUserRequest = {
  userId: string;
  adminUserId: string;
};
