import { ReactElement, useEffect, useState } from "react";
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";

import { BsSearch } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { UserReducerInitialState } from "../../types/reducer-types";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import {
  useAllUsersQuery,
  useDeleteUserMutation,
} from "../../app/services/userAPI";
import { responseToast } from "../../utils/features";
import { CustomError } from "../../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../Loader";

interface UserType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columnHelper = createColumnHelper<UserType>();

const columns = [
  columnHelper.accessor("avatar", {
    header: "Avatar",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("gender", {
    header: "Gender",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("role", {
    header: "Role",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("action", {
    header: "Action",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
];

const CustomerTable = () => {
  const { user } = useSelector((state: RootState) => state.user);

  const { data, isError, error, isLoading } = useAllUsersQuery(user?._id!);

  const [rows, setRows] = useState<UserType[]>([]);

  const [deleteUser] = useDeleteUserMutation();

  const deleteHandler = async (userId: string) => {
    const res = await deleteUser({ userId, adminUserId: user?._id! });
    responseToast(res, null, "");
  };
  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  useEffect(() => {
    if (data)
      setRows(
        data.users.map((i) => ({
          avatar: (
            <img
              style={{
                borderRadius: "50%",
              }}
              src={i.photo}
              alt={i.name}
            />
          ),
          name: i.name,
          email: i.email,
          gender: i.gender,
          role: i.role,
          action: (
            <button
              disabled={i.role === "admin"}
              onClick={() => deleteHandler(i._id)}
            >
              <FaTrash />
            </button>
          ),
        }))
      );
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
      <h2 className="heading">Customers</h2>
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

export default CustomerTable;
