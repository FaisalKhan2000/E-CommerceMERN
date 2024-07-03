import AdminSidebar from "../../components/admin/AdminSidebar";
import CustomerTable from "../../components/admin/CustomerTable";

const Customers = () => {
  return (
    <div className="admin-container">
      <AdminSidebar />

      <main>
        <CustomerTable />
      </main>
    </div>
  );
};

export default Customers;
