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
dotenv.config();

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

  return res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Product Created Successfully",
  });
};

export const getLatestProducts = async (
  req: Request<{}, {}, NewProductRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
  return res.status(StatusCodes.OK).json({
    success: true,
    products,
  });
};

export const getAllCategories = async (
  req: Request<{}, {}, NewProductRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const categories = await Product.distinct("category");

  return res.status(StatusCodes.OK).json({
    success: true,
    categories,
  });
};

export const getAdminProducts = async (
  req: Request<{}, {}, NewProductRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const products = await Product.find({});

  return res.status(StatusCodes.OK).json({
    success: true,
    products,
  });
};

export const getSingleProduct = async (
  req: Request<{ id: string }, {}, NewProductRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const product = await Product.find({ _id: id });

  return res.status(StatusCodes.OK).json({
    success: true,
    product,
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
