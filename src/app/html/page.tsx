"use client";

import {
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import "./index.scss";
import React from "react";

export const header = [
  {
    header: "Info",
    columns: [
      {
        accessorKey: "age",
        header: "Age",
        size: 100,
      },
      {
        header: "More Info",
        columns: [
          {
            accessorKey: "visits",
            header: "Visits",
          },
          {
            accessorKey: "status",
            header: "Status",
          },
          {
            header: "Progress",
            columns: [
              {
                accessorKey: "visits1",
                header: "Visits",
              },
              {
                accessorKey: "status1",
                header: "Status1",
              },
            ],
          },
        ],
      },
    ],
  },
];

type Column = ColumnDef<any>;

export default function Html() {
  const columns = React.useMemo<Column[]>(() => header, []);
  const data = React.useMemo(() => [], []);

  const table = useReactTable({
    data,
    getCoreRowModel: getCoreRowModel(),
    columns,
  });

  return (
    <div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => {
                const rowSpan = calculateRowSpan(headerGroup.headers, index); // Function to calculate rowSpan
                return (
                  <th key={header.id} rowSpan={rowSpan}>
                    {header.isPlaceholder
                      ? null
                      : header.render("header")}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
      </table>
    </div>
  );
}

// Custom function to calculate rowSpan based on your header structure
function calculateRowSpan(headers, index) {
  // You can add logic to check the header group structure and assign rowSpan accordingly
  // For example:
  if (headers[index].header === "Age") {
    return 3; // Rowspan for "Age"
  }
  if (headers[index].header === "Visits" || headers[index].header === "Status") {
    return 2; // Rowspan for "Visits" and "Status" under "More Info"
  }
  return 1; // Default to no rowspan for other columns
}


// export default function Html() {
//   const table = useReactTable({
//     data,
//     getCoreRowModel: getCoreRowModel(),
//     columns: header,
//   });

//   return (
//     <div>
//       <table>
//         <tr>
//           <th colSpan={5}>Info</th>
//         </tr>
//         <tr>
//           <th rowSpan={3}>Age</th>
//           <th colSpan={4}>More Info</th>
//         </tr>
//         <tr>
//           <th rowSpan={2}>Visits</th>
//           <th rowSpan={2}>Status</th>
//           <th colSpan={2}>Progress</th>
//         </tr>
//         <tr>
//           <td>Visits</td>
//           <td>Status1</td>
//         </tr>
//       </table>
//     </div>
//   );
// }
