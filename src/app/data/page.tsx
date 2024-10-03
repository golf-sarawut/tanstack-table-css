"use client"
import React from "react";
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
  Row,
} from "@tanstack/react-table";
import "./index.scss";

type RowActionsProps = {
  row: Row<Person>;
};

const RowActions: React.FC<RowActionsProps> = ({ row }) => {
  const handleEdit = () => {
    console.log("Edit:", row.original);
  };

  const handleDelete = () => {
    console.log("Delete:", row.original);
  };

  return (
    <div>
      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

// Define your row shape
type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

const columnHelper = createColumnHelper<Person>();

const defaultColumns = [
  // Display Column
  columnHelper.display({
    id: "actions",
    cell: (props) => <RowActions row={props.row} />,
  }),
  // Grouping Column
  columnHelper.group({
    header: "Name",
    footer: (props) => props.column.id,
    columns: [
      columnHelper.accessor("firstName", {
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => row.lastName, {
        id: "lastName",
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: (props) => props.column.id,
      }),
    ],
  }),
  columnHelper.group({
    header: "Info",
    footer: (props) => props.column.id,
    columns: [
      columnHelper.accessor("age", {
        header: () => "Age",
        footer: (props) => props.column.id,
      }),
      columnHelper.group({
        header: "More Info",
        columns: [
          columnHelper.accessor("visits", {
            header: () => <span>Visits</span>,
            footer: (props) => props.column.id,
          }),
          columnHelper.accessor("status", {
            header: "Status",
            footer: (props) => props.column.id,
          }),
          columnHelper.accessor("progress", {
            header: "Profile Progress",
            footer: (props) => props.column.id,
          }),
        ],
      }),
    ],
  }),
];

// Example data
const data: Person[] = [
  {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    visits: 12,
    status: "Active",
    progress: 80,
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    age: 25,
    visits: 15,
    status: "Inactive",
    progress: 60,
  },
  // Add more rows here...
];

const MyTable = () => {
  const table = useReactTable({
    data,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const headerGroup = table.getHeaderGroups();

  return (
    <table>
      <thead>
        {headerGroup.map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} colSpan={header.colSpan}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
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
      {/* <tfoot>
        {table.getFooterGroups().map((footerGroup) => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map((header) => (
              <td key={header.id}>
                {flexRender(
                  header.column.columnDef.footer,
                  header.getContext()
                )}
              </td>
            ))}
          </tr>
        ))}
      </tfoot> */}
    </table>
  );
};

export default function Data() {
  return <div>
    <MyTable/>
  </div>;
}
