import { Form } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import FormRow from "../../components/FormRow";
import SubmitButton from "../../components/SubmitButton";
import { useState, ChangeEvent } from "react";

const NewProduct = () => {
  const [photo, setPhoto] = useState<string | null>(null);

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhoto(reader.result);
        }
      };
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <Form method="post" className="form">
            <h2>New Product</h2>

            <FormRow
              type="text"
              name="name"
              labelText="Name"
              placeholder="Name"
            />
            <FormRow
              type="text"
              name="price"
              labelText="Price"
              placeholder="Price"
            />
            <FormRow
              type="text"
              name="stock"
              labelText="Stock"
              placeholder="Stock"
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

            {photo && <img src={photo} alt="Selected product" />}
            <SubmitButton />
          </Form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
