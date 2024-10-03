"use client";

import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import './index.scss';

export const makeColumns = (num) => [
  {
    header: 'Info',
    columns: [
      {
        accessorKey: 'age',
        header: 'Age',
        meta: {
          rowSpan: 3,
        },
        size: 100,
      },
      {
        header: 'More Info',
        columns: [
          {
            accessorKey: 'visits',
            meta: {
              rowSpan: 2,
            },
            header: 'Visits',
          },
          {
            accessorKey: 'status',
            meta: {
              rowSpan: 2,
            },
            header: 'Status',
          },
          {
            accessorKey: 'progress',
            header: 'Progress',
            columns: [
              {
                accessorKey: 'visits1',
                header: 'Visits',
              },
              {
                accessorKey: 'status1',
                header: 'Status1',
              },
            ],
          },
        ],
      },
    ],
  },
  ...[...Array(num)].map((_, i) => {
    return {
      accessorKey: i.toString(),
      header: 'Column ' + i.toString(),
      size: Math.floor(Math.random() * 150) + 100,
      meta: {
        rowSpan: 4,
      },
    };
  }),
];

export const makeData = (num, columns) =>
  [...Array(num)].map((_, i) => ({
    ...Object.fromEntries(columns.map((col) => [col.accessorKey, 'Table' + i])),
  }));

export type Person = ReturnType<typeof makeData>[0];

export const ReportTable = () => {
  const columns = React.useMemo<ColumnDef<Person>[]>(() => makeColumns(1000), []);

  const [data, _setData] = React.useState(() =>
    makeData(1000, [
      {
        accessorKey: 'firstName',
        cell: (info) => info.getValue(),
        size: Math.floor(Math.random() * 150) + 100,
      },
      {
        accessorKey: 'lastname',
        cell: (info) => info.getValue(),
        header: () => <span>Last Name asdc</span>,
        size: Math.floor(Math.random() * 150) + 100,
      },
      ...columns,
    ]),
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  console.log(table.getHeaderGroups(), data, columns);

  const { rows } = table.getRowModel();

  const visibleColumns = table.getVisibleLeafColumns();

  //The virtualizers need to know the scrollable container element
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  //we are using a slightly different virtualization strategy for columns (compared to virtual rows) in order to support dynamic row heights
  const columnVirtualizer = useVirtualizer({
    count: visibleColumns.length,
    estimateSize: (index) => visibleColumns[index].getSize(), //estimate width of each column for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    horizontal: true,
    overscan: 3, //how many columns to render on each side off screen each way (adjust this for performance)
  });

  //dynamic row height virtualization - alternatively you could use a simpler fixed row height strategy without the need for `measureElement`
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  const virtualColumns = columnVirtualizer.getVirtualItems();
  const virtualRows = rowVirtualizer.getVirtualItems();

  //different virtualization strategy for columns - instead of absolute and translateY, we add empty columns to the left and right
  let virtualPaddingLeft: number | undefined;
  let virtualPaddingRight: number | undefined;

  if (columnVirtualizer && virtualColumns?.length) {
    virtualPaddingLeft = virtualColumns[0]?.start ?? 0;
    virtualPaddingRight = columnVirtualizer.getTotalSize() - (virtualColumns[virtualColumns.length - 1]?.end ?? 0);
  }
  const renderedHeadersRef = React.useRef(new Set());

  //All important CSS styles are included as inline styles for this example. This is not recommended for your code.
  return (
    <div className="app">
      <div
        className="container"
        ref={tableContainerRef}
        style={{
          overflow: 'auto', //our scrollable table container
          position: 'relative', //needed for sticky header
          height: '800px', //should be a fixed height
        }}
      >
        {/* Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights */}
        <table style={{ display: 'grid' }}>
          <thead
            style={{
              display: 'grid',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} style={{ display: 'flex', width: '100%' }}>
                {virtualPaddingLeft ? (
                  // fake empty column to the left for virtualization scroll padding
                  <th style={{ display: 'flex', width: virtualPaddingLeft }} />
                ) : null}
                {virtualColumns.map((vc) => {
                  const header = headerGroup.headers[vc.index];
                  const rowSpan = header.column.columnDef.meta?.rowSpan;

                  const columnRelativeDepth = header.depth - header.column.depth;

                  // if (columnRelativeDepth > 1) {
                  //   return (
                  //     <th
                  //       style={{
                  //         display: 'flex',
                  //         width: header.getSize(),
                  //       }}
                  //     >
                  //       <div></div>
                  //     </th>
                  //   );
                  // }

                  // let rowSpan = 1;
                  // if (header.isPlaceholder) {
                  //   const leafs = header.getLeafHeaders();
                  //   rowSpan = leafs[leafs.length - 1].depth - header.depth;
                  // }

                  return (
                    <th
                      style={{
                        display: 'flex',
                        width: header.getSize(),
                        minHeight: '32px',
                      }}
                      colSpan={header.colSpan}
                      rowSpan={rowSpan}
                    >
                      <div
                        {...{
                          className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </div>
                    </th>
                  );
                })}
                {virtualPaddingRight ? (
                  //fake empty column to the right for virtualization scroll padding
                  <th style={{ display: 'flex', width: virtualPaddingRight }} />
                ) : null}
              </tr>
            ))}
          </thead>
          {/*<thead>*/}
          {/*  {table.getHeaderGroups().map((headerGroup) => (*/}
          {/*    <tr key={headerGroup.id}>*/}
          {/*      {headerGroup.headers.map((header) => {*/}
          {/*        const rowSpan = header.column.columnDef.meta?.rowSpan;*/}

          {/*        if (!header.isPlaceholder && rowSpan !== undefined && header.id === header.column.id) {*/}
          {/*          return null;*/}
          {/*        }*/}

          {/*        return (*/}
          {/*          <th key={header.id} colSpan={header.colSpan} rowSpan={rowSpan}>*/}
          {/*            {flexRender(header.column.columnDef.header, header.getContext())}*/}
          {/*          </th>*/}
          {/*        );*/}
          {/*      })}*/}
          {/*    </tr>*/}
          {/*  ))}*/}
          {/*</thead>*/}

          <tbody
            style={{
              display: 'grid',
              height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
              position: 'relative', //needed for absolute positioning of rows
            }}
          >
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index] as Row<Person>;
              const visibleCells = row.getVisibleCells();

              return (
                <tr
                  data-index={virtualRow.index} //needed for dynamic row height measurement
                  ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                  key={row.id}
                  style={{
                    display: 'flex',
                    position: 'absolute',
                    transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                    width: '100%',
                  }}
                >
                  {virtualPaddingLeft ? (
                    //fake empty column to the left for virtualization scroll padding
                    <td style={{ display: 'flex', width: virtualPaddingLeft }} />
                  ) : null}
                  {virtualColumns.map((vc) => {
                    const cell = visibleCells[vc.index];
                    return (
                      <td
                        key={cell.id}
                        style={{
                          display: 'flex',
                          width: cell.column.getSize(),
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                  {virtualPaddingRight ? (
                    //fake empty column to the right for virtualization scroll padding
                    <td style={{ display: 'flex', width: virtualPaddingRight }} />
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
