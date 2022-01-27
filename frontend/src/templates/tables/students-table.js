import React, { Component, useMemo } from "react";
import { useTable, usePagination } from 'react-table';
import TablePagination from "../components/pagination";
    
export function StudentsTable() {
    const columns = React.useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'id', // accessor is the "key" in the data
            },
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Parent',
                accessor: 'parent',
            },
            {
                Header: 'School',
                accessor: 'school',
            },
            {
                Header: 'Bus Route',
                accessor: 'route',
            },
        ],
        []
    )
    
    const data = React.useMemo(
        () => [
            {
                id: '0',
                name: 'example',
                parent: 'example',
                school: 'example',
                route: 'example',
            },
            {
                id: '1',
                name: 'example',
                parent: 'example',
                school: 'example',
                route: 'example',
            },
            {
                id: '2',
                name: 'example',
                parent: 'example',
                school: 'example',
                route: 'example',
            },
        ],
        []
    )
    
    // const tableInstance = useTable({ columns, data })
     
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        // Instead of using 'rows', we'll use page,
        // which has only the rows for the active page

        // The rest of these things are super handy, too ;)
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
        columns,
        data,
        initialState: { pageIndex: 0, pageSize: 10 },
        },
        usePagination
    )

    return (
        <>
            {/* <pre>
                <code>
                {JSON.stringify(
                    {
                    pageIndex,
                    pageSize,
                    pageCount,
                    canNextPage,
                    canPreviousPage,
                    },
                    null,
                    2
                )}
                </code>
            </pre> */}
    
            {/* // apply the table props */}
            <table {...getTableProps()} className="table table-striped table-hover">
                <thead>
                {// Loop over the header rows
                headerGroups.map(headerGroup => (
                    // Apply the header row props
                    <tr {...headerGroup.getHeaderGroupProps()}>
                    {// Loop over the headers in each row
                    headerGroup.headers.map(column => (
                        // Apply the header cell props
                        <th {...column.getHeaderProps()}>
                        {// Render the header
                        column.render('Header')}
                        </th>
                    ))}
                    </tr>
                ))}
                </thead>
                {/* Apply the table body props */}
                <tbody {...getTableBodyProps()}>
                {// Loop over the table rows
                page.map((row, i) => {
                    // Prepare the row for display
                    prepareRow(row)
                    return (
                    // Apply the row props
                    <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        })}
                    </tr>
                    )
                })}
                </tbody>
            </table>

            {/* <nav aria-label="Students Pagination">
                <ul class="pagination">
                    <li class="page-item"><a class="page-link" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>Previous</a></li>
                    <li class="page-item"><a class="page-link" onClick={() => previousPage(0)} disabled={!canPreviousPage}>1</a></li>
                    <li class="page-item"><a class="page-link" onClick={() => nextPage()} disabled={!canNextPage}>2</a></li>
                    <li class="page-item"><a class="page-link" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>3</a></li>
                    <li class="page-item"><a class="page-link" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>Next</a></li>
                </ul>
            </nav> */}

            <TablePagination
                pageIndex={pageIndex}
                pageOptions={pageOptions}
                previousPage={previousPage}
                canPreviousPage={canPreviousPage}
                nextPage={nextPage}
                canNextPage={canNextPage}
                pageSize={pageSize}
                page={page}
            />

            {/* <div className="pagination">
                <button className="btn btn-secondary" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                {'<<'}
                </button>{' '}
                <button className="btn btn-secondary" onClick={() => previousPage()} disabled={!canPreviousPage}>
                {'<'}
                </button>{' '}
                <button className="btn btn-secondary" onClick={() => nextPage()} disabled={!canNextPage}>
                {'>'}
                </button>{' '}
                <button className="btn btn-secondary" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                {'>>'}
                </button>{' '}
                <span>
                Page{' '}
                <strong>
                    {pageIndex + 1} of {pageOptions.length}
                </strong>{' '}
                </span>
                <span>
                | Go to page:{' '}
                <input
                    type="number"
                    defaultValue={pageIndex + 1}
                    onChange={e => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0
                    gotoPage(page)
                    }}
                    style={{ width: '100px' }}
                />
                </span>{' '}
                <select
                value={pageSize}
                onChange={e => {
                    setPageSize(Number(e.target.value))
                }}
                >
                {[10, 20, 30, 40, 50].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                    </option>
                ))}
                </select>
            </div> */}
        </>
    )
}