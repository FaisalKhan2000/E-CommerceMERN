import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ReactElement, useEffect, useState } from "react";

import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";

import { BsSearch } from "react-icons/bs";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { UserReducerInitialState } from "../../types/reducer-types";
import { useAllOrdersQuery } from "../../app/services/orderAPI";
import { CustomError } from "../../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../Loader";

interface TransactionType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}

const columnHelper = createColumnHelper<TransactionType>();

const columns = [
  columnHelper.accessor("user", {
    header: "User",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("amount", {
    header: "Amount",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("discount", {
    header: "Discount",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("quantity", {
    header: "Quantity",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("action", {
    header: "Action",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
];

const TransactionTable = () => {
  const { user } = useSelector(
    (state: { user: UserReducerInitialState }) => state.user
  );

  const { data, isLoading, isError, error } = useAllOrdersQuery(user?._id!);

  const [rows, setRows] = useState<TransactionType[]>([]);

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  useEffect(() => {
    if (data) {
      setRows(
        data.orders.map((order) => ({
          user: order.user.name,
          amount: order.total,
          discount: order.discount,
          quantity: order.orderItems.length,
          status: (
            <span
              className={
                order.status === "Processing"
                  ? "red"
                  : order.status === "Shipped"
                  ? "green"
                  : "purple"
              }
            >
              {order.status}
            </span>
          ),
          action: <Link to={`/admin/transaction/${order._id}`}> Manage </Link>,
        }))
      );
    }
  }, [data]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 5, //default page size
  });

  const handleGlobalFilterChange = (value: string) => {
    setFiltering(value);
  };

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: (newPagination) => {
      setPagination(newPagination);
      // You can update your component state here if needed (e.g., for displaying current page)
    },
    state: {
      sorting: sorting,
      globalFilter: filtering,
      pagination,
    },

    onSortingChange: setSorting,
    onGlobalFilterChange: handleGlobalFilterChange,
  });

  // const { pagination } = table.getState();
  const currentPage = pagination.pageIndex + 1;

  return (
    <div className="dashboard-product-box">
      <h2 className="heading">Products</h2>
      <div className="search-filter">
        <BsSearch />
        <input
          type="text"
          placeholder="search for products..."
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
        />
      </div>

      {isLoading ? (
        <Skeleton length={25} />
      ) : (
        <table className="table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() ? (
                      header.column.getIsSorted() === "asc" ? (
                        <AiOutlineSortAscending />
                      ) : (
                        <AiOutlineSortDescending />
                      )
                    ) : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {rows.length > 5 && (
        <div className="table-pagination">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </button>
          <span>
            {" "}
            {currentPage} of {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
