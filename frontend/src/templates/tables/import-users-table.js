import React, { useCallback, useEffect } from "react";
import { Table } from "./table";
import { useState } from "react";
import { TableEditable } from "./table-editable";
import Autocomplete from "react-google-autocomplete";
import { GOOGLE_API_KEY } from "../../constants";
    
export function ImportUsersTable({ data, showAll, pageIndex, canPreviousPage, canNextPage, 
    updatePageCount, pageSize, totalPages, searchValue, updateImportData }) {

    const columns = React.useMemo(
        () => [
            {
                Header: '#',
                accessor: 'row_num',
                id: 'row_num',
                disableFilter: true,
                disableSort: true,
                Cell: ({ cell: { value } }) => (
                    <div className="text-center mt-2">{value}</div>
                )
            },
            {
                Header: 'Name',
                accessor: d => Array(`${d.name}`, d.error.name,`${d.error.error_message.name}`,d.error.duplicate_name,`Name may be a duplicate in file import`),
                id: 'name',
                disableSort: true,
                // sortDirection: sort.accessor === 'name' ? sort.sortDirection : 'none'
            },
            {
                Header: 'Email',
                accessor: d => Array(`${d.email}`,d.error.email,`${d.error.error_message.email}`,d.error.duplicate_email,`Email is a duplicate in file import`),
                id: 'email',
                disableSort: true
                // sortDirection: sort.accessor === 'email' ? sort.sortDirection : 'none'
            },
            {
                Header: 'Phone Number',
                accessor: d => Array(`${d.phone_number}`,d.error.phone_number,`${d.error.error_message.phone_number}`),
                disableFilter: true,
                id: 'phone_number',
                disableSort: true
                // sortDirection: sort.accessor === 'phone_number' ? sort.sortDirection : 'none'
            },       
            {
                Header: 'Address',
                accessor: d => Array(`${d.address}`,d.error.address,`${d.error.error_message.address}`),
                disableFilter: true,
                id: 'address',
                disableSort: true,
            },
            {
                Header: 'Exclude?',
                accessor: d => Array(d.exclude),
                disableFilter: true,
                id: 'exclude',
                disableSort: true
            },
        ],
    )

    return (
        <TableEditable
            columns={columns}
            origData={data}
            searchOn={false}
            navUrl={"/users/"}
            // rowProps={row => ({
            //     style: {
            //         cursor: "pointer"
            //     }
            // })}
            // pageIndex={pageIndex}
            // canPreviousPage={canPreviousPage}
            // canNextPage={canNextPage}
            // updatePageCount={updatePageCount}
            // pageSize={pageSize}
            // totalPages={totalPages}
            // columnHeaderClick={columnHeaderClick}
            // sortOptions={sort}
            // searchValue={searchValue}
            updateData={updateImportData}
        />
    )
}