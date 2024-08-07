import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllOrdersResponse,
  MessageResponse,
  NewOrderRequest,
  OrderDetailsResponse,
  UpdateOrderRequest,
} from "../../types/api-types";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/order/`,
  }),
  tagTypes: ["myOrders", "allOrders", "orderDetails"],
  endpoints: (builder) => ({
    newOrder: builder.mutation<MessageResponse, NewOrderRequest>({
      query: (order) => ({
        url: "new",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["myOrders", "allOrders", "orderDetails"],
    }),
    updateOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({
      query: ({ userId, orderId }) => ({
        url: `${orderId}?id=${userId}`,
        method: "PUT",
      }),
      invalidatesTags: ["myOrders", "allOrders", "orderDetails"],
    }),
    deleteOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({
      query: ({ userId, orderId }) => ({
        url: `${orderId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["myOrders", "allOrders", "orderDetails"],
    }),
    myOrders: builder.query<AllOrdersResponse, string>({
      query: (id) => `my?id=${id}`,
      providesTags: ["myOrders"],
    }),
    allOrders: builder.query<AllOrdersResponse, string>({
      query: (id) => `all?id=${id}`,
      providesTags: ["allOrders"],
    }),
    orderDetails: builder.query<OrderDetailsResponse, string>({
      query: (id) => id,
      providesTags: ["orderDetails"],
    }),
  }),
});

export const {
  useNewOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useMyOrdersQuery,
  useAllOrdersQuery,
  useOrderDetailsQuery,
} = orderApi;
