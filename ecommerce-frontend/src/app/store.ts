import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./services/userAPI";
import { setupListeners } from "@reduxjs/toolkit/query";
import { userSlice } from "./features/userSlice";
import { productAPI } from "./services/productAPI";

export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [productAPI.reducerPath]: productAPI.reducer,
    [userSlice.name]: userSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userAPI.middleware, productAPI.middleware),
});

setupListeners(store.dispatch);
