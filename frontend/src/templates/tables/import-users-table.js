import React, { useCallback, useEffect } from "react";
import { Table } from "./table";
import { useState } from "react";
import { TableEditable } from "./table-editable";
    
export function ImportUsersTable({ data, showAll, pageIndex, canPreviousPage, canNextPage, 
    updatePageCount, pageSize, totalPages, searchValue }) {

    // const [sort, setSort] = useState({ sortDirection: 'ASC', accessor: 'name' });

    // useEffect(() => {
    //     updatePageCount(pageIndex, sort, searchValue)
    // }, [sort])

    const columns = React.useMemo(
        () => [
            {
                Header: '#',
                accessor: 'row_num',
                id: 'row_num',
                disableFilter: true,
                disableSort: true
            },
            {
                Header: 'Name',
                accessor: 'name',
                id: 'name',
                disableSort: true
                // sortDirection: sort.accessor === 'name' ? sort.sortDirection : 'none'
            },
            {
                Header: 'Email',
                accessor: 'email',
                id: 'email',
                disableSort: true
                // sortDirection: sort.accessor === 'email' ? sort.sortDirection : 'none'
            },
            // {
            //     id:'role',
            //     Header: 'User Type',
            //     accessor: d => { return d.role },
            //     disableFilter: true,
            //     sortDirection: sort.accessor === 'is_staff' ? sort.sortDirection : 'none' //@Kyra not sure if should be fixed
            // },
            {
                Header: 'Phone Number',
                accessor: 'phone_number',
                disableFilter: true,
                id: 'phone_number',
                disableSort: true
                // sortDirection: sort.accessor === 'phone_number' ? sort.sortDirection : 'none'
            },       
            {
                Header: 'Address',
                accessor: 'address',
                disableFilter: true,
                id: 'address',
                disableSort: true
                // sortDirection: sort.accessor === 'address' ? sort.sortDirection : 'none'
            },
        ],
        // [sort]
    )

    // const columnHeaderClick = async (column) => {
    //     switch (column.sortDirection) {
    //       case 'none':
    //         setSort({ sortDirection: 'ASC', accessor: column.id });
    //         break;
    //       case 'ASC':
    //         setSort({ sortDirection: 'DESC', accessor: column.id });
    //         break;
    //       case 'DESC':
    //         setSort({ sortDirection: 'none', accessor: column.id });
    //         break;
    //     }
    // };

    return (
        <TableEditable
            columns={columns}
            data={data}
            searchOn={false}
            // searchLabel="Search by name or email..."
            // ourGlobalFilterFunction={ourGlobalFilterFunction}
            // showAll={showAll}
            navUrl={"/users/"}
            rowProps={row => ({
                style: {
                    cursor: "pointer"
                }
            })}
            // pageIndex={pageIndex}
            // canPreviousPage={canPreviousPage}
            // canNextPage={canNextPage}
            // updatePageCount={updatePageCount}
            // pageSize={pageSize}
            // totalPages={totalPages}
            // columnHeaderClick={columnHeaderClick}
            // sortOptions={sort}
            searchValue={searchValue}
        />
    )
}