import React, { Component, useMemo, useCallback } from "react";
import ReactTable from 'react-table';
import { useTable, useSortBy, usePagination, setSortBy, useState, setFilter, setState, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table';
import TablePagination from "../components/pagination";
import { SORT, SORT_ASC, SORT_DESC } from "../../constants";
import { useNavigate } from 'react-router-dom';
    
export function UsersTable({ data }) {
    const navigate = useNavigate();

    // Global filter, search from any column

    // function GlobalFilter({
    //     preGlobalFilteredRows,
    //     globalFilter,
    //     setGlobalFilter,
    // }) {
    //     const count = preGlobalFilteredRows.length
    //     const [value, setValue] = React.useState(globalFilter)
    //     const onChange = useAsyncDebounce(value => {
    //         setGlobalFilter(value || undefined)
    //     }, 200)

    //     return (
    //         <span>
    //             <input
    //                 className="form-control"
    //                 value={value || ""}
    //                 onChange={e => {
    //                     setValue(e.target.value);
    //                     onChange(e.target.value);
    //                 }}
    //                 placeholder={`Search by name...`}
    //             />
    //         </span>
    //     )
    // }

    // Filters for each column

    // function DefaultColumnFilter({
    //     column: { filterValue, preFilteredRows, setFilter },
    // }) {
    //     const count = preFilteredRows.length
    
    //     return (
    //         <input
    //             className="form-control"
    //             value={filterValue || ''}
    //             onChange={e => {
    //                 setFilter(e.target.value || undefined)
    //             }}
    //             placeholder={`Search by name...`}
    //         />
    //     )
    // } 

    // Filter by multiple columns
    const handleFilterInputChange = (e) => {
        console.log(e.currentTarget);
        const { value } = e.currentTarget;
        setGlobalFilter(value);
    };

    const ourGlobalFilterFunction = useCallback(
        (rows, ids, query) => {
            return rows.filter((row) => 
                row.values["name"].includes(query) ||
                row.values["email"].includes(query)
            );
        },
        [],
    );

    const columns = React.useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'id', // accessor is the "key" in the data
                disableSortBy: true,
                disableFilter: true
            },
            {
                Header: 'Name',
                accessor: d => `${d.first_name} ${d.last_name}`,
                id: 'name'
            },
            {
                Header: 'Email',
                accessor: 'email',
            },
            {
                id:'is_staff',
                Header: 'User Type',
                accessor: d => { return d.is_staff ? 'Admin' : 'General' },
                disableSortBy: true,
                disableFilter: true
            },            
            {
                Header: 'Address',
                accessor: 'address',
                disableSortBy: true,
                disableFilter: true
            },
        ],
        []
    )

    // Default column for column filtering

    // const defaultColumn = React.useMemo(
    //     () => ({
    //         // Default Filter UI
    //         Filter: DefaultColumnFilter,
    //     }),
    //     []
    // )
        
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        setFilter,
        setSortBy,
        setState,
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
        state: { searchInput, pageIndex, pageSize },
        preGlobalFilteredRows,
        setGlobalFilter,
        state,
    } = useTable(
        {
        columns,
        data,
        // defaultColumn,
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

    return (
        <>

            {/* <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
            /> */}

            <input
                id="search-input"
                type="search" 
                className="form-control w-25 mb-3"
                placeholder="Search by name or email..."
                onChange={handleFilterInputChange}
            />

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
                page.map((row, i) => {
                    // Prepare the row for display
                    prepareRow(row)
                    return (
                    // Apply the row props
                    <tr {...row.getRowProps()} onClick={() => navigate("/users/" + row.original.id)}>
                        {row.cells.map(cell => {
                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        })}
                    </tr>
                    )
                })}
                </tbody>
            </table>

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
        </>
    )
}