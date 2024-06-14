import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import {
  BaseQueryType,
  NewProductRequestBody,
  SearchRequestQuery,
  SortKeyType,
} from "../types/types.js";
import { Product } from "../models/product.js";
import { BadRequestError, NotFoundError } from "../utils/customError.js";
import { rm } from "fs";
import dotenv from "dotenv";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";
dotenv.config();
// import { faker } from "@faker-js/faker";

// Revalidate on New, Update, Delete, Product & on New Order
export const getLatestProducts = async (
  req: Request<{}, {}, NewProductRequestBody>,
  res: Response,
  next: NextFunction
) => {
  let products;

  if (myCache.has("latest-products")) {
    products = JSON.parse(myCache.get("latest-products") as string);
  } else {
    products = await Product.find({}).sort({ createdAt: -1 }).limit(5);

    // storing data in myCache
    myCache.set("latest-products", JSON.stringify(products));
  }

  return res.status(StatusCodes.OK).json({
    success: true,
    products,
  });
};

// Revalidate on New, Update, Delete, Product & on New Order
export const getAllCategories = async (
  req: Request<{}, {}, NewProductRequestBody>,
  res: Response,
  next: NextFunction
) => {
  let categories;
  if (myCache.has("categories")) {
    categories = JSON.parse(myCache.get("categories") as string);
  } else {
    categories = await Product.distinct("category");

    myCache.set("categories", JSON.stringify(categories));
  }

  return res.status(StatusCodes.OK).json({
    success: true,
    categories,
  });
};

// Revalidate on New, Update, Delete, Product & on New Order
export const getAdminProducts = async (
  req: Request<{}, {}, NewProductRequestBody>,
  res: Response,
  next: NextFunction
) => {
  let products;

  if (myCache.has("all-products")) {
    products = JSON.parse(myCache.get("all-products") as string);
  } else {
    products = await Product.find({});
    myCache.set("all-products", JSON.stringify(products));
  }

  return res.status(StatusCodes.OK).json({
    success: true,
    products,
  });
};

// Revalidate on New, Update, Delete, Product & on New Order
export const getSingleProduct = async (
  req: Request<{ id: string }, {}, NewProductRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  let product;
  if (myCache.has(`product-${id}`)) {
    product = JSON.parse(myCache.get(`product-${id}`) as string);
  } else {
    product = await Product.find({ _id: id });

    myCache.set(`product-${id}`, JSON.stringify(product));
  }

  return res.status(StatusCodes.OK).json({
    success: true,
    product,
  });
};

export const newProduct = async (
  req: Request<{}, {}, NewProductRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { name, price, stock, category } = req.body;

  const photo = req.file;

  if (!photo) throw new BadRequestError("Please add photo");

  if (!name || !price || !stock || !category) {
    rm(photo.path, () => {
      console.log("deleted");
    });
    throw new BadRequestError("Please enter all fields");
  }

  await Product.create({
    name,
    price,
    stock,
    category: category.toLowerCase(),
    photo: photo?.path,
  });

  // clearing cache
  await invalidateCache({ product: true });

  return res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Product Created Successfully",
  });
};

export const updateProduct = async (
  req: Request<{ id: string }, {}, NewProductRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, price, stock, category } = req.body;
  const photo = req.file;

  let product = await Product.findById(id);

  if (!product) {
    throw new NotFoundError("Product Not Found");
  }

  if (photo) {
    rm(product.photo!, () => {
      console.log("Old Photo Deleted");
    });
    product.photo = photo.path;
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;

  await product.save();

  // clearing cache
  await invalidateCache({ product: true, productId: String(product._id) });

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "Product Updated Successfully",
  });
};

export const deleteProduct = async (
  req: Request<{ id: string }, {}, NewProductRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const product = await Product.findOne({ _id: id });

  if (!product) {
    throw new NotFoundError("Product Not Found");
  }
  rm(product.photo!, () => {
    console.log("Product Photo Deleted");
  });

  await product.deleteOne();

  // clearing cache
  await invalidateCache({ product: true, productId: String(product._id) });

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "Product Deleted Successfully",
  });
};

export const getAllProducts = async (
  req: Request<{}, {}, {}, SearchRequestQuery>,
  res: Response,
  next: NextFunction
) => {
  const { search, sort, category, price } = req.query;

  const page = Number(req.query.page) || 1;

  const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;

  const skip = limit * (page - 1);

  // baseQuery
  const baseQuery: BaseQueryType = {};

  if (search)
    baseQuery.name = {
      $regex: search,
      $options: "i", // case sensitive
    };

  if (price) baseQuery.price = { $lte: Number(price) };

  if (category) baseQuery.category = category;

  const sortOptions: { [key: string]: SortKeyType } = {
    newest: "-createdAt",
    oldest: "createdAt",
    asc: "price",
    desc: "-price",
  };

  const sortKey: SortKeyType = sort ? sortOptions[sort] : sortOptions.newest;

  // using this to increase  performance
  const [products, filteredOnlyProduct] = await Promise.all([
    await Product.find(baseQuery).sort(sortKey).limit(limit).skip(skip),

    await Product.find(baseQuery),
  ]);

  // const products = await Product.find(baseQuery)
  //   .sort(sortKey)
  //   .limit(limit)
  //   .skip(skip);

  // // using this to get the length of filtered products
  // const filteredOnlyProduct = await Product.find(baseQuery);

  const totalPage = Math.ceil(filteredOnlyProduct.length / limit);

  return res.status(StatusCodes.OK).json({
    success: true,
    products,
    page,
    totalPage,
  });
};

// const generateRandomProducts = async (count = 10) => {
//   const products = Array.from({ length: count }, () => ({
//     name: faker.commerce.productName(),
//     photo:
//       "https://images-cdn.ubuy.co.in/659dd5c3fb1686238525d689-amazon-new-multiple-items-box-random.jpg",
//     price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//     stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//     category: faker.commerce.department(),
//     createdAt: new Date(faker.date.past()),
//     updatedAt: new Date(faker.date.recent()),
//     __v: 0,
//   }));

//   await Product.create(products);
//   console.log({ success: true });
// };

// generateRandomProducts(100);

// const deleteRandomsProducts = async (count: number = 10) => {
//   const products = await Product.find({}).skip(2);

//   for (let i = 0; i < products.length; i++) {
//     const product = products[i];
//     await product.deleteOne();
//   }

//   console.log({ succecss: true });
// };

// deleteRandomsProducts(100)
