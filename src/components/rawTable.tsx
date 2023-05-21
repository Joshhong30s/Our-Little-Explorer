import { useMemo } from 'react'
import { useTable, Column, useSortBy, usePagination, Row } from 'react-table'

interface Data {
  Day: string | Date
  Weight: number
  Height: number
  TotalFeed: number
  TotalPee: number
  TotalPoop: number
}

interface RawTableProps {
  data: Data[]
}

export default function RawTable({ data }: RawTableProps) {
  const columns: Column<Data>[] = useMemo(
    () => [
      {
        Header: ' 日期',
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
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    // @ts-expect-error page is not in type def
    page,
    // @ts-expect-error nextPage is not in type def
    nextPage,
    // @ts-expect-error previosPage is not in type def
    previousPage,
    // @ts-expect-error previosPage is not in type def
    canNextPage,
    // @ts-expect-error previosPage is not in type def
    canPreviousPage,
    // @ts-expect-error previosPage is not in type def
    pageOptions,
    // @ts-expect-error
    gotoPage,
    // @ts-expect-error
    pageCount,
    // @ts-expect-error
    setPageSize,
    state,
    prepareRow,
  } = useTable(
    {
      columns,
      data: data,
    },
    useSortBy,
    usePagination
  )

  // @ts-expect-error is not in type def
  const { pageIndex, pageSize } = state

  return (
    <div className='bg-card overflow-x-auto'>
      <table
        className='w-full text-center border-collapse'
        {...getTableProps()}
      >
        <thead className='bg-teal-980'>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  className='px-4 py-3 text-white font-semibold border-b-2 border-slate-400'
                  // @ts-expect-error getSortByToggleProps is not in type def
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render('Header')}
                  <span>
                    {/* @ts-expect-error property isSorted is not in type def */}
                    {column.isSorted ? (column.isSortedDesc ? ' ▽' : ' △') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row: Row<Data>) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()} className='even:bg-gray-200'>
                {row.cells.map((cell) => (
                  <td
                    className='px-4 py-3 border-b border-slate-300'
                    {...cell.getCellProps()}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className='text-center mt-4 space-x-4'>
        Page{' '}
        <span className='font-semibold'>
          {pageIndex + 1} of {pageOptions.length}{' '}
        </span>
        <button onClick={() => gotoPage(0)} disabled={!previousPage}>
          {' << '}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          上一頁
        </button>
        <span>
          | 跳到{' '}
          <input
            type='number'
            defaultValue={' '}
            onChange={(e) => {
              const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(pageNumber)
            }}
            className='w-8'
          ></input>
          頁
        </span>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {[10, 30, 60].map((pageSize) => (
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
  )
}
