import { CartItem, Order, Product, ShippingInfo, User } from "./types";

export type CustomError = {
  status: number;
  data: {
    message: string;
    success: boolean;
  };
};

export type MessageResponse = {
  success: boolean;
  message: string;
};

export type AllUsersResponse = {
  success: boolean;
  users: User[];
};

export type UserResponse = {
  success: boolean;
  user: User;
};

export type CategoryResponse = {
  success: boolean;
  categories: string[];
};

export type AllProductsResponse = {
  success: boolean;
  products: Product[];
};

export type SearchProductsResponse = {
  success: boolean;
  products: Product[];
  page: number;
  totalPage: number;
};

export type SearchProductsRequest = {
  page: number;
  price: number;
  category: string;
  search: string;
  sort: string;
};

export type ProductDetailResponse = {
  success: boolean;
  product: Product;
};

export type NewProductRequest = {
  id: string;
  formData: FormData;
};
export type UpdateProductRequest = {
  userId: string;
  productId: string;
  formData: FormData;
};
export type DeleteProductRequest = {
  userId: string;
  productId: string;
};

export type DeleteUserRequest = {
  userId: string;
  adminUserId: string;
};

export type NewOrderRequest = {
  shippingInfo: ShippingInfo;
  orderItems: CartItem[];
  subTotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  user: string;
};

export type UpdateOrderRequest = {
  userId: string;
  orderId: string;
};

export type AllOrdersResponse = {
  success: boolean;
  orders: Order[];
};

export type OrderDetailsResponse = {
  success: boolean;
  order: Order;
};
