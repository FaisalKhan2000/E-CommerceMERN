import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import SuspenseWrapper from "./components/SuspenseWrapper";

const Home = lazy(() => import("./pages/Home"));
const Search = lazy(() => import("./pages/Search"));
const Cart = lazy(() => import("./pages/Cart"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <SuspenseWrapper>
        <Home />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/search",
    element: (
      <SuspenseWrapper>
        <Search />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/cart",
    element: (
      <SuspenseWrapper>
        <Cart />
      </SuspenseWrapper>
    ),
  },
]);
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
