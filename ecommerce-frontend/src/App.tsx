import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { lazy, useEffect } from "react";
import SuspenseWrapper from "./components/SuspenseWrapper";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { userExist, userNotExist } from "./app/features/userSlice";
import { getUser } from "./app/services/userAPI";
import { UserReducerInitialState } from "./types/reducer-types";
import Loader, { LoaderLayout } from "./components/Loader";

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

const App = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(
    (state: { user: UserReducerInitialState }) => state.user
  );

  // Assuming you have the authentication and admin status available
  const isAuthenticated = user ? true : false; // or false
  const isAdmin = user?.role === "admin" ? true : false; // or false

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getUser(user.uid);

        dispatch(userExist(data.user));
      } else {
        dispatch(userNotExist());
      }
    });
  }, []);

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

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
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <SuspenseWrapper>
            <Header />
            <Cart />
          </SuspenseWrapper>
        </ProtectedRoute>
      ),
    },
    {
      path: "/login",
      element: (
        <ProtectedRoute isAuthenticated={user ? false : true}>
          <SuspenseWrapper>
            <Login />
          </SuspenseWrapper>
        </ProtectedRoute>
      ),
    },

    // Logged In User Routes
    {
      path: "/shipping",
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <SuspenseWrapper>
            {/* <Header /> */}
            <Shipping />
          </SuspenseWrapper>
        </ProtectedRoute>
      ),
    },
    {
      path: "/orders",
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <SuspenseWrapper>
            <Header />
            <Orders />
          </SuspenseWrapper>
        </ProtectedRoute>
      ),
    },
    {
      path: "/order/:id",
      element: (
        <SuspenseWrapper>
          {/* <Header /> */}
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            adminOnly={true}
            admin={isAdmin}
          >
            <OrderDetails />
          </ProtectedRoute>
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
        <ProtectedRoute
          isAuthenticated={isAuthenticated}
          adminOnly={true}
          admin={isAdmin}
        >
          <SuspenseWrapper>
            <Products />
          </SuspenseWrapper>
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/transaction",
      element: (
        <ProtectedRoute
          isAuthenticated={isAuthenticated}
          adminOnly={true}
          admin={isAdmin}
        >
          <SuspenseWrapper>
            <Transaction />
          </SuspenseWrapper>
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/customer",
      element: (
        <ProtectedRoute
          isAuthenticated={isAuthenticated}
          adminOnly={true}
          admin={isAdmin}
        >
          <SuspenseWrapper>
            <Customers />
          </SuspenseWrapper>
        </ProtectedRoute>
      ),
    },

    // Charts
    {
      path: "admin/chart/bar",
      element: (
        <ProtectedRoute
          isAuthenticated={isAuthenticated}
          adminOnly={true}
          admin={isAdmin}
        >
          <SuspenseWrapper>
            <BarCharts />
          </SuspenseWrapper>
        </ProtectedRoute>
      ),
    },
    {
      path: "admin/chart/pie",
      element: (
        <ProtectedRoute
          isAuthenticated={isAuthenticated}
          adminOnly={true}
          admin={isAdmin}
        >
          <SuspenseWrapper>
            <PieCharts />
          </SuspenseWrapper>
        </ProtectedRoute>
      ),
    },
    {
      path: "admin/chart/line",
      element: (
        <ProtectedRoute
          isAuthenticated={isAuthenticated}
          adminOnly={true}
          admin={isAdmin}
        >
          <SuspenseWrapper>
            <LineCharts />
          </SuspenseWrapper>
        </ProtectedRoute>
      ),
    },
    // Apps

    {
      path: "admin/app/coupon",
      element: (
        <ProtectedRoute
          isAuthenticated={isAuthenticated}
          adminOnly={true}
          admin={isAdmin}
        >
          <SuspenseWrapper>
            <Coupon />
          </SuspenseWrapper>
        </ProtectedRoute>
      ),
    },

    // management
    {
      path: "admin/product/new",
      element: (
        <ProtectedRoute
          isAuthenticated={isAuthenticated}
          adminOnly={true}
          admin={isAdmin}
        >
          <SuspenseWrapper>
            <NewProduct />
          </SuspenseWrapper>
        </ProtectedRoute>
      ),
    },
    {
      path: "admin/product/:id",
      element: (
        <ProtectedRoute
          isAuthenticated={isAuthenticated}
          adminOnly={true}
          admin={isAdmin}
        >
          <SuspenseWrapper>
            <ProductManagement />
          </SuspenseWrapper>
        </ProtectedRoute>
      ),
    },
    {
      path: "admin/transaction/:id",
      element: (
        <ProtectedRoute
          isAuthenticated={isAuthenticated}
          adminOnly={true}
          admin={isAdmin}
        >
          <SuspenseWrapper>
            <TransactionManagement />
          </SuspenseWrapper>
        </ProtectedRoute>
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
};

export default App;
