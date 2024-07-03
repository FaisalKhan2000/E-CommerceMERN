import AdminSidebar from "../../components/admin/AdminSidebar";
import TransactionTable from "../../components/admin/TransactionTable";

const Transaction = () => {
  return (
    <div className="admin-container">
      <AdminSidebar />

      <main>
        <TransactionTable />
      </main>
    </div>
  );
};

export default Transaction;
