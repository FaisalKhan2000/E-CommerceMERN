import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import ProductTable from "../../components/admin/ProductTable";
import { FaPlus } from "react-icons/fa";

const Products = () => {
  return (
    <div className="admin-container">
      <AdminSidebar />

      <main>
        <ProductTable />
      </main>

      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;
