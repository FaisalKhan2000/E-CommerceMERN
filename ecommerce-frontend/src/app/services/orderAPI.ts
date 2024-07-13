import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/order/`,
  }),
  endpoints: (builder) => ({
    newOrder: builder.mutation({}),
  }),
});

// export {} = orderApi
