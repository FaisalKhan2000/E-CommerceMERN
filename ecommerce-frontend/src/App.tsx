import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import SuspenseWrapper from "./components/SuspenseWrapper";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";

const Home = lazy(() => import("./pages/Home"));
const Search = lazy(() => import("./pages/Search"));
const Cart = lazy(() => import("./pages/Cart"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Login = lazy(() => import("./pages/Login"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));

// Importing Admin Routes
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Products = lazy(() => import("./pages/admin/Products"));
const Transaction = lazy(() => import("./pages/admin/Transaction"));
const Customers = lazy(() => import("./pages/admin/Customers"));
const NewProduct = lazy(() => import("./pages/admin/management/NewProduct"));
const ProductManagement = lazy(
  () => import("./pages/admin/management/ProductManagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/management/TransactionManagement")
);
const BarCharts = lazy(() => import("./pages/admin/charts/BarCharts"));
const PieCharts = lazy(() => import("./pages/admin/charts/PieCharts"));
const LineCharts = lazy(() => import("./pages/admin/charts/LineCharts"));
const Coupon = lazy(() => import("./pages/admin/apps/Coupon"));

// Assuming you have the authentication and admin status available
const isAuthenticated = true; // or false
const isAdmin = true; // or false

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <SuspenseWrapper>
        <Header />
        <Home />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/search",
    element: (
      <SuspenseWrapper>
        <Header />
        <Search />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/cart",
    element: (
      <SuspenseWrapper>
        <Header />
        <Cart />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/login",
    element: (
      <SuspenseWrapper>
        <Login />
      </SuspenseWrapper>
    ),
  },

  // Logged In User Routes
  {
    path: "/shipping",
    element: (
      <SuspenseWrapper>
        {/* <Header /> */}
        <Shipping />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/orders",
    element: (
      <SuspenseWrapper>
        {/* <Header /> */}
        <Orders />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/order/:id",
    element: (
      <SuspenseWrapper>
        {/* <Header /> */}
        <OrderDetails />
      </SuspenseWrapper>
    ),
  },

  // admin routes
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute
        isAuthenticated={isAuthenticated}
        adminOnly={true}
        admin={isAdmin}
      >
        <SuspenseWrapper>
          <Dashboard />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin/product",
    element: (
      <SuspenseWrapper>
        <Products />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/admin/transaction",
    element: (
      <SuspenseWrapper>
        <Transaction />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/admin/customer",
    element: (
      <SuspenseWrapper>
        <Customers />
      </SuspenseWrapper>
    ),
  },

  // Charts
  {
    path: "admin/chart/bar",
    element: (
      <SuspenseWrapper>
        <BarCharts />
      </SuspenseWrapper>
    ),
  },
  {
    path: "admin/chart/pie",
    element: (
      <SuspenseWrapper>
        <PieCharts />
      </SuspenseWrapper>
    ),
  },
  {
    path: "admin/chart/line",
    element: (
      <SuspenseWrapper>
        <LineCharts />
      </SuspenseWrapper>
    ),
  },
  // Apps

  {
    path: "admin/app/coupon",
    element: (
      <SuspenseWrapper>
        <Coupon />
      </SuspenseWrapper>
    ),
  },

  // management
  {
    path: "admin/product/new",
    element: (
      <SuspenseWrapper>
        <NewProduct />
      </SuspenseWrapper>
    ),
  },
  {
    path: "admin/product/:id",
    element: (
      <SuspenseWrapper>
        <ProductManagement />
      </SuspenseWrapper>
    ),
  },
  {
    path: "admin/transaction/:id",
    element: (
      <SuspenseWrapper>
        <TransactionManagement />
      </SuspenseWrapper>
    ),
  },
]);
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
