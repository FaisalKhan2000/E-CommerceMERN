import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useLatestProductsQuery } from "../app/services/productAPI";
import toast from "react-hot-toast";

import { Skeleton } from "../components/Loader";

const Home = () => {
  const { data, isError, isLoading } = useLatestProductsQuery("");
  console.log(data);
  const addToCartHandler = () => {};

  if (isError) toast.error("Cannot Fetch the Products");
  return (
    <div className="home">
      <section></section>
      <h1>
        Latest Products{" "}
        <Link to={"/search"} className="findmore">
          More
        </Link>{" "}
      </h1>
      <main>
        {isLoading ? (
          <>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} style={{ height: "25rem" }}>
                <Skeleton width="18.75rem" length={1} height="20rem" />
                <Skeleton width="18.75rem" length={2} height="1.95rem" />
              </div>
            ))}
          </>
        ) : (
          data?.products.map((i) => (
            <ProductCard
              key={i._id}
              productId={i._id}
              name={i.name}
              price={i.price}
              stock={i.stock}
              handler={addToCartHandler}
              photo={i.photo}
            />
          ))
        )}
        {/* <ProductCard
          productId="asdddd"
          name="Macbook"
          price={4545}
          stock={435}
          photo="https://m.media-amazon.com/images/I/71jG+e7roXL._SL1500_.jpg"
          handler={addToCart}
        /> */}
      </main>
    </div>
  );
};

export default Home;
