import { useState } from "react";
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";

interface TableHOCProps<T extends Record<string, unknown>> {
  columns: ColumnDef<T>[];
  data: T[];
  containerClassname: string;
  heading: string;
  showPagination?: boolean;
}

function TableHOC<T extends Record<string, unknown>>({
  columns,
  data,
  containerClassname,
  heading,
  showPagination = false,
}: TableHOCProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState("");

  const handleGlobalFilterChange = (value: string) => {
    setFiltering(value);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: handleGlobalFilterChange,
  });

  return (
    <div className={containerClassname}>
      <h2>{heading}</h2>
      <input
        type="text"
        value={filtering}
        onChange={(e) => setFiltering(e.target.value)}
      />
      <table className="w3-table-all w3-hoverable">
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

        {showPagination && (
          <tfoot>
            <tr>
              <td colSpan={columns.length}>
                <div className="w3-bar">
                  <button
                    onClick={() => table.setPageIndex(0)}
                    className="w3-button w3-black"
                  >
                    First Page
                  </button>
                  <button
                    disabled={!table.getCanPreviousPage()}
                    onClick={() => table.previousPage()}
                    className="w3-button w3-teal"
                  >
                    Previous Page
                  </button>
                  <button
                    disabled={!table.getCanNextPage()}
                    onClick={() => table.nextPage()}
                    className="w3-button w3-black"
                  >
                    Next Page
                  </button>
                  <button
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    className="w3-button w3-teal"
                  >
                    Last Page
                  </button>
                </div>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

export default TableHOC;
