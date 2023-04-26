/* eslint-disable react/jsx-key */
import { useMemo } from 'react'
import { useTable } from 'react-table'

export default function RawTable({ data }) {
  const columns = useMemo(
    () => [
      {
        Header: 'Day',
        accessor: 'Day',
      },
      {
        Header: 'Weight',
        accessor: 'Weight',
      },
      {
        Header: 'FeedingTime',
        accessor: 'FeedingTime',
      },
      {
        Header: 'FeedingVolume',
        accessor: 'FeedingVolume',
      },
      {
        Header: 'DiaperTime',
        accessor: 'DiaperTime',
      },
      {
        Header: 'DiaperColor',
        accessor: 'DiaperColor',
      },
      {
        Header: ' 事件',
        accessor: 'Event',
      },
    ],
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data: data,
  })

  return (
    <div className='overflow-x-auto'>
      <table
        className='w-full text-center border-collapse'
        {...getTableProps()}
      >
        <thead className='bg-slate-600'>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  className='px-4 py-3 text-white font-semibold border-b-2 border-slate-400'
                  {...column.getHeaderProps()}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()} className='even:bg-slate-100'>
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
        <tfoot>
          {footerGroups.map((footerGroup) => (
            <tr {...footerGroup.getFooterGroupProps()}>
              {footerGroup.headers.map((column) => (
                <td
                  className='px-4 py-3 bg-slate-200 font-semibold border-t-2 border-slate-300'
                  {...column.getFooterProps()}
                >
                  {column.render('Footer')}
                </td>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  )
}
