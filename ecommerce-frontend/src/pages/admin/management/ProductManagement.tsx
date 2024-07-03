import { useParams } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import FormRow from "../../components/FormRow";
import SubmitButton from "../../components/SubmitButton";
import { useState, ChangeEvent, FormEvent } from "react";

const img =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&w=1000&q=804";

const ProductManagement = () => {
  const [name, setName] = useState<string>("Puma Shoes");
  const [price, setPrice] = useState<number>(2000);
  const [stock, setStock] = useState<number>(10);
  const [photo, setPhoto] = useState<string>(img);

  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [photoUpdate, setPhotoUpdate] = useState<string>(photo);

  const { id } = useParams<{ id: string }>();

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setName(nameUpdate);
    setPrice(priceUpdate);
    setStock(stockUpdate);
    setPhoto(photoUpdate);
  };

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoUpdate(reader.result);
        }
      };
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <section>
          <strong>ID - {id}</strong>
          <img src={photo} alt="Product" />
          <p>{name}</p>
          {stock > 0 ? (
            <span className="green">{stock} Available</span>
          ) : (
            <span className="red">Not Available</span>
          )}
          <h3>${price}</h3>
        </section>

        <article>
          <form onSubmit={submitHandler} className="form">
            <h2>Manage Product</h2>

            <FormRow
              type="text"
              name="name"
              labelText="Name"
              placeholder="Name"
              value={nameUpdate}
              onChange={(e) => setNameUpdate(e.target.value)}
            />
            <FormRow
              type="number"
              name="price"
              labelText="Price"
              placeholder="Price"
              value={priceUpdate}
              onChange={(e) => setPriceUpdate(Number(e.target.value))}
            />
            <FormRow
              type="number"
              name="stock"
              labelText="Stock"
              placeholder="Stock"
              value={stockUpdate}
              onChange={(e) => setStockUpdate(Number(e.target.value))}
            />
            <div className="form-row">
              <label htmlFor="photo" className="form-label">
                Photo
              </label>
              <input
                required
                type="file"
                id="photo"
                name="photo"
                onChange={changeImageHandler}
                className="form-input"
                accept="image/*"
              />
            </div>

            {photoUpdate && <img src={photoUpdate} alt="Selected product" />}
            <SubmitButton />
          </form>
        </article>
      </main>
    </div>
  );
};

export default ProductManagement;
