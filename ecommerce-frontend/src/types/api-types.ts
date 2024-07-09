export type MessageResponse = {
  success: boolean;
  message: string;
};

export type DeleteUserRequest = {
  userId: string;
  adminUserId: string;
};
