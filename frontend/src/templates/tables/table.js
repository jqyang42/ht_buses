import React from 'react';
import { useTable, useSortBy, usePagination, useFilters, useGlobalFilter } from 'react-table';
import { SORT, SORT_ASC, SORT_DESC } from "../../constants";
import { useNavigate } from "react-router-dom";
import SearchBar from './search-bar';
import TablePagination from "./pagination";

export function Table({ columns, data, searchOn, searchLabel, ourGlobalFilterFunction, showAll, navUrl, rowProps = () => ({}) }) {
    const navigate = useNavigate();

    const handleFilterInputChange = (e) => {
        // console.log(e.currentTarget);
        const { value } = e.currentTarget;
        setGlobalFilter(value);
    };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        nextPage,
        previousPage,
        state: { 
            pageIndex,
            pageSize
        },
        setGlobalFilter,
    } = useTable(
        {
        columns,
        data,
        globalFilter: ourGlobalFilterFunction,
        initialState: { 
            searchInput: "",
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
        useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination,
    )

    console.log(rows)

    return (
        <>
            { searchOn ?
            <SearchBar label={searchLabel} handleFilterInputChange={handleFilterInputChange} ourGlobalFilterFunction={ourGlobalFilterFunction} /> : "" }

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
                        
                        {/* Column filter UI */}
                        {/* <div>{column.canFilter ? column.render('Filter') : null}</div> */}
                        
                        {/* Sorting UI */}
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
                    <tr {...row.getRowProps(rowProps(row))} onClick={navUrl ? () => navigate(navUrl + row.original.id) : () => void 0}>
                        {row.cells.map(cell => {
                        return <td {...cell.getCellProps()}> {cell.render('Cell')}</td>
                        })}
                    </tr>
                    )
                }) : 
                page.map((row, i) => {
                    // Prepare the row for display
                    prepareRow(row)
                    return (
                    <tr {...row.getRowProps(rowProps(row))} onClick={navUrl ? () => navigate(navUrl + row.original.id) : () => void 0}>
                        {row.cells.map(cell => {
                        return <td {...cell.getCellProps()}> {cell.render('Cell')}</td>
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