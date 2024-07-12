import { ChangeEvent, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import {
  useDeleteProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
} from "../../../app/services/productAPI";
import { Skeleton } from "../../../components/Loader";
import { server } from "../../../components/ProductCard";
import { UserReducerInitialState } from "../../../types/reducer-types";
import { responseToast } from "../../../utils/features";
import { FieldValues, useForm } from "react-hook-form";

import axios from "axios";

type ProductFormValues = {
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  photo?: File;
};

const ProductManagement = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(
    (state: { user: UserReducerInitialState }) => state.user
  );

  const { data, isLoading, isError } = useProductDetailsQuery(params.id!);
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const getDefaultValues = async () => {
    const { data: defaultData } = await axios.get(
      `${import.meta.env.VITE_SERVER}/api/v1/product/${params.id}`
    );

    return {
      name: defaultData?.product.name || " ",
      price: defaultData?.product.price || 0,
      stock: defaultData?.product.stock || 0,
      category: defaultData?.product.category || "",
      description: defaultData?.product.description || "",
      photo: defaultData?.product.photo || "",
    };
  };

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<ProductFormValues>({
    defaultValues: getDefaultValues,
  });

  const [photoUpdate, setPhotoUpdate] = useState<string>();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoUpdate(reader.result);
        }
      };
    }
  };

  const onSubmit = async (data: FieldValues) => {
    const formData = new FormData();

    try {
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("stock", data.stock.toString());

      // Access the file input directly from data
      const file = data.photo?.[0]; // Assuming data.photo is an array
      if (file) {
        formData.append("photo", file);
      }

      formData.append("category", data.category);

      const res = await updateProduct({
        formData,
        userId: user?._id!,
        productId: params.id!,
      });
      responseToast(res, navigate, "/admin/product");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      const res = await deleteProduct({
        userId: user?._id!,
        productId: data?.product._id!,
      });
      responseToast(res, navigate, "/admin/product");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            <section>
              <strong>ID - {data?.product._id}</strong>
              <img src={`${server}/${data?.product.photo}`} alt="Product" />
              <p>{data?.product.name}</p>
              {data?.product.stock! > 0 ? (
                <span className="green">{data?.product.stock} Available</span>
              ) : (
                <span className="red"> Not Available</span>
              )}
              <h3>₹{data?.product.price}</h3>
            </section>
            <article>
              <button
                className="product-delete-btn"
                onClick={handleDeleteProduct}
              >
                <FaTrash />
              </button>
              <form onSubmit={handleSubmit(onSubmit)}>
                <h2>Manage</h2>
                <div>
                  <label>Name</label>
                  <input {...register("name")} type="text" placeholder="Name" />
                </div>

                <div>
                  <label>Description</label>
                  <textarea
                    {...register("description")}
                    placeholder="Description"
                  />
                </div>
                <div>
                  <label>Price</label>
                  <input
                    {...register("price")}
                    type="number"
                    placeholder="Price"
                  />
                </div>
                <div>
                  <label>Stock</label>
                  <input
                    {...register("stock")}
                    type="number"
                    placeholder="Stock"
                  />
                </div>

                <div>
                  <label>Category</label>
                  <input
                    {...register("category")}
                    type="text"
                    placeholder="eg. laptop, camera etc"
                  />
                </div>

                <div>
                  <label>Photo</label>
                  <input
                    {...register("photo")}
                    type="file"
                    onChange={changeImageHandler}
                  />
                </div>

                {photoUpdate && <img src={photoUpdate} alt="New Image" />}
                <button disabled={isSubmitting} type="submit">
                  Update
                </button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default ProductManagement;
