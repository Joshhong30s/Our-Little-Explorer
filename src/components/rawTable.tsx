import { useMemo } from 'react';
import { useTable, Column, useSortBy, usePagination, Row } from 'react-table';

interface Data {
  Day: string | Date;
  Weight: number;
  Height: number;
  TotalFeed: number;
  TotalPee: number;
  TotalPoop: number;
}

interface RawTableProps {
  data: Data[];
}

export default function RawTable({ data }: RawTableProps) {
  const columns: Column<Data>[] = useMemo(
    () => [
      {
        Header: ' 日期',
        accessor: 'Day',
      },
      {
        Header: '體重',
        accessor: 'Weight',
      },
      {
        Header: '身長',
        accessor: 'Height',
      },
      {
        Header: '喝奶量',
        accessor: 'TotalFeed',
      },
      {
        Header: '小便次數',
        accessor: 'TotalPee',
      },
      {
        Header: '大便次數',
        accessor: 'TotalPoop',
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
    state,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy,
    usePagination
  ) as any;

  const { pageIndex, pageSize } = state;

  return (
    <div className="bg-white overflow-x-auto">
      <table
        className="w-full text-center border-collapse bg-white"
        {...getTableProps()}
      >
        <thead className="bg-black">
          {headerGroups.map((headerGroup: any) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column: any) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={column.id}
                  className="px-4 py-3 text-white font-semibold"
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' ▽' : ' △') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {page.map((row: Row<Data>) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                key={row.id}
                className="even:bg-gray-200"
              >
                {row.cells.map(cell => (
                  <td
                    {...cell.getCellProps()}
                    key={cell.column.id}
                    className="px-4 py-3 border-b border-slate-300"
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="text-center space-x-4 bg-black text-white px-4 py-3 font-semibold">
        Page{' '}
        <span className="font-semibold">
          {pageIndex + 1} of {pageOptions.length}{' '}
        </span>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {' << '}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          上一頁
        </button>
        <span>
          | 跳到{' '}
          <input
            type="number"
            min="1"
            max={pageCount}
            defaultValue={pageIndex + 1}
            onChange={e => {
              const pageNumber = Math.min(
                Math.max(Number(e.target.value) - 1, 0),
                pageCount - 1
              );
              gotoPage(pageNumber);
            }}
            className="w-8 bg-transparent text-white"
          />
          頁
        </span>
        <select
          value={pageSize}
          className="bg-transparent text-white"
          onChange={e => setPageSize(Number(e.target.value))}
        >
          {[10, 30, 60].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          下一頁
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {' >> '}
        </button>
      </div>
    </div>
  );
}
