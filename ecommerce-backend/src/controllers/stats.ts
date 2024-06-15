import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { Order } from "../models/order.js";
import { calculatePercentage } from "../utils/features.js";

export const getDashboardStats = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  let stats = {};

  if (myCache.has("admin-stats")) {
    stats = JSON.parse(myCache.get("admin-stats") as string);
  } else {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const thisMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: today,
    };

    const lastMonth = {
      start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      end: new Date(today.getFullYear(), today.getMonth() + 1, 0), // 0 corresponds to 28,29,30,31. JavaScript handles different month lengths (28, 29, 30, or 31 days) and leap years automatically when calculating the last day of the month.
    };

    // * products

    // this month products
    const thisMonthProductsPromise = await Product.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    // last month products
    const lastMonthProductsPromise = await Product.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    // * Users

    // this month users
    const thisMonthUsersPromise = await User.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    // last month users
    const lastMonthUsersPromise = await User.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    // * Orders

    // this month orders
    const thisMonthOrdersPromise = await Order.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    // last month orders
    const lastMonthOrdersPromise = await Order.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    // last six months orders
    const lastSixMonthOrdersPromise = await Order.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    });

    const latestTransactionsPromise = Order.find({})
      .select(["orderItems", "discount", "total", "StatusCodes"])
      .limit(4);

    const [
      thisMonthProducts,
      thisMonthUsers,
      thisMonthOrders,
      lastMonthProducts,
      lastMonthUsers,
      lastMonthOrders,
      productsCount,
      usersCount,
      allOrders,
      lastSixMonthOrders,
      categories,
      femaleUsersCount,
      latestTransactions,
    ] = await Promise.all([
      thisMonthProductsPromise,
      thisMonthUsersPromise,
      thisMonthOrdersPromise,
      lastMonthProductsPromise,
      lastMonthUsersPromise,
      lastMonthOrdersPromise,
      Product.countDocuments(),
      User.countDocuments(),
      Order.find({}).select("total"),
      lastSixMonthOrdersPromise,
      Product.distinct("category"),
      User.countDocuments({ gender: "female" }),
      latestTransactionsPromise,
    ]);

    // REVENUE
    const thisMonthRevenue = thisMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const lastMonthRevenue = lastMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const changePercent = {
      revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
      product: calculatePercentage(
        thisMonthProducts.length,
        lastMonthProducts.length
      ),
      user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
      order: calculatePercentage(
        thisMonthOrders.length,
        lastMonthOrders.length
      ),
    };

    const revenue = allOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const count = {
      revenue,
      user: usersCount,
      product: productsCount,
      order: allOrders.length,
    };

    // * ORDER V/S REVENUE CHART
    const orderMonthCounts = new Array(6).fill(0);
    const orderMonthlyRevenue = new Array(6).fill(0);

    lastSixMonthOrders.forEach((order) => {
      const creationDate = new Date(order.createdAt);
      const yearDiff = today.getFullYear() - creationDate.getFullYear();
      const monthDiff =
        yearDiff * 12 + today.getMonth() - creationDate.getMonth();

      // Ensure that the order is within the last 6 months
      if (monthDiff >= 0 && monthDiff < 6) {
        orderMonthCounts[5 - monthDiff] += 1;
        orderMonthlyRevenue[5 - monthDiff] += order.total;
      }
    });

    // * category
    const categoriesCountPromise = categories.map((category) =>
      Product.countDocuments({ category })
    );

    const categoriesCount = await Promise.all(categoriesCountPromise);

    const categoryCount: Record<string, number>[] = [];

    categories.forEach((category, i) => {
      categoryCount.push({
        [category]: Math.round((categoriesCount[i] / productsCount) * 100),
      });
    });

    //* Gender Ratio
    const userRatio = {
      male: usersCount - femaleUsersCount,
      female: femaleUsersCount,
    };

    const modifiedLatestTransactions = latestTransactions.map((i) => ({
      _id: i._id,
      discount: i.discount,
      amount: i.total,
      quantity: i.orderItems.length,
      status: i.status,
    }));

    stats = {
      categoryCount,
      changePercent,
      count,
      chart: {
        order: orderMonthCounts,
        revenue: orderMonthlyRevenue,
      },
      userRatio,
      latestTransactions: modifiedLatestTransactions,
    };

    myCache.set("admin-stats", JSON.stringify(stats));
  }

  return res.status(StatusCodes.OK).json({
    success: true,
    stats,
  });
};

export const getPieCharts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let charts;

  if (myCache.has("admin-pie-charts")) {
    charts = JSON.parse(myCache.get("admin-pie-charts") as string);
  } else {
    const allOrderPromise = Order.find({}).select([
      "total",
      "discount",
      "subtotal",
      "tax",
      "shippingCharges",
    ]);

    // PROMISE ALL
    const [
      processingOrder,
      shippedOrder,
      deliveredOrder,
      categories,
      productsCount,
      productsOutOfStock,
      allOrders,
      allUsers,
      adminUsers,
      customerUsers,
    ] = await Promise.all([
      Order.countDocuments({ status: "Processing" }),
      Order.countDocuments({ status: "Shipped" }),
      Order.countDocuments({ status: "Delivered" }),
      Product.distinct("category"),
      Product.countDocuments(),
      Product.countDocuments({ stock: 0 }),
      allOrderPromise,
      User.find({}).select(["dob"]),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "user" }),
    ]);

    // orderFulfillment
    const orderFulfillment = {
      processing: processingOrder,
      shipped: shippedOrder,
      delivered: deliveredOrder,
    };

    // category
    const categoriesCountPromise = categories.map((category) =>
      Product.countDocuments({ category })
    );

    const categoriesCount = await Promise.all(categoriesCountPromise);

    const categoryCount: Record<string, number>[] = [];

    categories.forEach((category, i) => {
      categoryCount.push({
        [category]: Math.round((categoriesCount[i] / productsCount) * 100),
      });
    });

    const stockAvailability = {
      inStock: productsCount - productsOutOfStock,
      outOfStock: productsOutOfStock,
    };

    const grossIncome = allOrders.reduce(
      (prev, order) => prev + (order.total || 0),
      0
    );

    const discount = allOrders.reduce(
      (prev, order) => prev + (order.discount || 0),
      0
    );

    const productionCost = allOrders.reduce(
      (prev, order) => prev + (order.shippingCharges || 0),
      0
    );

    const burnt = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);

    const marketingCost = Math.round(grossIncome * (30 / 100));

    const netMargin =
      grossIncome - discount - productionCost - burnt - marketingCost;

    // revenue distribution
    const revenueDistribution = {
      netMargin,
      discount,
      productionCost,
      burnt,
      marketingCost,
    };

    // user age group
    const usersAgeGroup = {
      teen: allUsers.filter((i) => i.age < 20).length,
      adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
      old: allUsers.filter((i) => i.age >= 40).length,
    };

    // admin customer
    const adminCustomer = {
      admin: adminUsers,
      customer: customerUsers,
    };

    charts = {
      orderFulfillment,
      productCategories: categoryCount,
      stockAvailability,
      revenueDistribution,
      usersAgeGroup,
      adminCustomer,
    };

    // caching
    myCache.set("admin-pie-charts", JSON.stringify(charts));
  }
  return res.status(StatusCodes.OK).json({
    success: true,
    charts,
  });
};

export const getBarCharts = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  return res.status(StatusCodes.OK).json({
    success: true,
  });
};

export const getLineCharts = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  return res.status(StatusCodes.OK).json({
    success: true,
  });
};
