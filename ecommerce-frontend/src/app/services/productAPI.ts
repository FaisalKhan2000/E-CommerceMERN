import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllProductsResponse,
  CategoryResponse,
  DeleteProductRequest,
  MessageResponse,
  NewProductRequest,
  ProductDetailResponse,
  SearchProductsRequest,
  SearchProductsResponse,
  UpdateProductRequest,
} from "../../types/api-types";

export const productAPI = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
  }),
  tagTypes: [
    "latest-products",
    "all-products",
    "categories",
    "search-products",
    "product-details",
  ],
  endpoints: (builder) => ({
    latestProducts: builder.query<AllProductsResponse, string>({
      query: () => `latest`,
      providesTags: ["latest-products"],
    }),

    allProducts: builder.query<AllProductsResponse, string>({
      query: (id) => `admin-products?id=${id}`,
      providesTags: ["all-products"],
    }),

    categories: builder.query<CategoryResponse, string>({
      query: () => `categories`,
      providesTags: ["categories"],
    }),

    searchProducts: builder.query<
      SearchProductsResponse,
      SearchProductsRequest
    >({
      query: ({ price, search, sort, category, page }) => {
        let baseQuery = `all?search=${search}&page=${page}`;

        if (price) {
          baseQuery += `&price=${price}`;
        }
        if (sort) {
          baseQuery += `&sort=${sort}`;
        }
        if (category) {
          baseQuery += `&category=${category}`;
        }

        return baseQuery;
      },
      providesTags: ["search-products"],
    }),
    productDetails: builder.query<ProductDetailResponse, string>({
      query: (id) => id,
      providesTags: ["product-details"],
    }),

    newProduct: builder.mutation<MessageResponse, NewProductRequest>({
      query: ({ formData, id }) => ({
        url: `new?id=${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [
        "all-products",
        "latest-products",
        "categories",
        "search-products",
        "product-details",
      ],
    }),

    updateProduct: builder.mutation<MessageResponse, UpdateProductRequest>({
      query: ({ formData, userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: [
        "all-products",
        "latest-products",
        "categories",
        "search-products",
        "product-details",
      ],
    }),
    deleteProduct: builder.mutation<MessageResponse, DeleteProductRequest>({
      query: ({ userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        "all-products",
        "latest-products",
        "categories",
        "search-products",
        "product-details",
      ],
    }),
  }),
});

export const {
  useLatestProductsQuery,
  useAllProductsQuery,
  useCategoriesQuery,
  useSearchProductsQuery,
  useProductDetailsQuery,
  useNewProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productAPI;
