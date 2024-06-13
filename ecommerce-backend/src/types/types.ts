export interface NewUserRequestBody {
  name: string;
  email: string;
  photo: string;
  gender: string;
  _id: string;
  dob: Date;
}

export interface NewProductRequestBody {
  name: string;
  price: number;
  stock: number;
  category: string;
}

export type SearchRequestQuery = {
  search?: string;
  price?: string;
  category?: string;
  sort?: string;
  page?: string;
};

export type BaseQueryType = {
  name?: {
    $regex: string;
    $options?: string;
  };
  price?: {
    $lte: number;
  };
  category?: string;
};

export type SortKeyType = "-createdAt" | "createdAt" | "price" | "-price";
