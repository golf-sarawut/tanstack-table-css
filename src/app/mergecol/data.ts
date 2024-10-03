export const makeColumns = (num: number) => [
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
  ];