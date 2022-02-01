import React, { Component, useMemo } from "react";
import { useTable, useSortBy, usePagination, setSortBy } from 'react-table';
import TablePagination from "../components/pagination";
import { SORT, SORT_ASC, SORT_DESC } from "../../constants";
import { useNavigate } from 'react-router-dom';
    
export function UserStudentsTable({ data, showAll }) {
    const navigate = useNavigate();

    const columns = React.useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'student_school_id', // accessor is the "key" in the data
            },
            {
                Header: 'Name',
                accessor: d => `${d.first_name} ${d.last_name}`,
            },
            {
                Header: 'Bus Route',
                accessor: 'route_name',
                className: 'unassigned'
            },
        ],
        []
    )
        
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        setSortBy,
        page,
        rows,
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
        initialState: { 
            pageIndex: 0,
            pageSize: 10,
            sortBy: [
                {
                    id: 'name',
                    desc: false
                }
            ]
        },
        },
        useSortBy,
        usePagination,
    )

    return (
        <>
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
                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                        {// Render the header
                        column.render('Header')}
                        <span className="w-auto ms-2 me-0 float-right text-end">
                            {!column.disableSortBy ? (column.isSorted
                            ? column.isSortedDesc
                                ? <img src={SORT_DESC} className="img-icon"></img>
                                : <img src={SORT_ASC} className="img-icon"></img>
                            : <img src={SORT} className="img-icon"></img>) : ''}
                        </span>
                        </th>
                    ))}
                    </tr>
                ))}
                </thead>
                {/* Apply the table body props */}
                <tbody {...getTableBodyProps()}>
                {// Loop over the table rows
                showAll ?
                rows.map((row, i) => {
                    // Prepare the row for display
                    prepareRow(row)
                    return (
                    // Apply the row props
                    <tr {...row.getRowProps()} onClick={() => navigate("/students/" + row.original.id)}>
                        {row.cells.map(cell => {
                        return <td {...cell.getCellProps()} className={(row.original.route_name === "Unassigned") ? `${cell.column.className ?? ""}` : ""}> {cell.render('Cell')}</td>
                        })}
                    </tr>
                    )
                }) : 
                page.map((row, i) => {
                    // Prepare the row for display
                    prepareRow(row)
                    return (
                    // Apply the row props
                    <tr {...row.getRowProps()} onClick={() => navigate("/students/" + row.original.id)}>
                        {row.cells.map(cell => {
                        return <td {...cell.getCellProps()} className={(row.original.route_name === "Unassigned") ? `${cell.column.className ?? ""}` : ""}> {cell.render('Cell')}</td>
                        })}
                    </tr>
                    )
                })}
                </tbody>
            </table>

            {
                showAll ? "" :
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
            }
        </>
    )
}