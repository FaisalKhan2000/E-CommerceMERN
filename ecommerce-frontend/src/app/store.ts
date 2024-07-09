import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./services/userAPI";
import { setupListeners } from "@reduxjs/toolkit/query";
import { userSlice } from "./features/userSlice";

export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [userSlice.name]: userSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userAPI.middleware),
});

setupListeners(store.dispatch);
