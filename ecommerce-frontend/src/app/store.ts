import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./services/userAPI";
import { setupListeners } from "@reduxjs/toolkit/query";
import { userSlice } from "./features/userSlice";
import { productAPI } from "./services/productAPI";
import { cartSlice } from "./features/cartSlice";
import { orderApi } from "./services/orderAPI";

export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [productAPI.reducerPath]: productAPI.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [userSlice.name]: userSlice.reducer,
    [cartSlice.name]: cartSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userAPI.middleware, productAPI.middleware),
});

setupListeners(store.dispatch);
