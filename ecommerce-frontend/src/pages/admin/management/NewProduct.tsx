import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";

import { useState, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../../types/reducer-types";
import { useNewProductMutation } from "../../../app/services/productAPI";
import { responseToast } from "../../../utils/features";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const ProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number().min(1, "price must be at least greater than 1"),
  stock: z.number().min(1, "stock must be at least greater than 1"),
  category: z.string(),
  photo: z.instanceof(File),
});

export type TProductSchema = z.infer<typeof ProductSchema>;

const NewProduct = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<TProductSchema>({
    resolver: zodResolver(ProductSchema),
  });

  const { user } = useSelector(
    (state: { user: UserReducerInitialState }) => state.user
  );

  const [prevPhoto, setPrevPhoto] = useState<string>();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") setPrevPhoto(reader.result);
      };
    }
  };

  const [newProduct] = useNewProductMutation();
  const navigate = useNavigate();

  const onSubmit = async (data: TProductSchema) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("stock", data.stock.toString());
    formData.append("photo", data.photo);
    formData.append("category", data.category);
    try {
      const res = await newProduct({ id: user?._id!, formData });

      responseToast(res, navigate, "/admin/product");
      reset();
    } catch (error) {
      console.log(error);
    } finally {
      // setIsLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2>New Product</h2>
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
              <input {...register("price")} type="number" placeholder="Price" />
            </div>
            <div>
              <label>Stock</label>
              <input {...register("stock")} type="number" placeholder="Stock" />
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

            {prevPhoto && <img src={prevPhoto} alt="New Image" />}

            <button disabled={isSubmitting} type="submit">
              Create
            </button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
