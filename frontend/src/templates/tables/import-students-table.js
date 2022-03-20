import React, { useCallback, useEffect } from "react";
import { Table } from "./table";
import { useState } from "react";
import { TableEditable } from "./table-editable";
import Autocomplete from "react-google-autocomplete";
import { GOOGLE_API_KEY } from "../../constants";
    
export function ImportStudentsTable({ data, showAll, pageIndex, canPreviousPage, canNextPage, 
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
                Header: 'ID',
                accessor: d => Array(`${d.student_id}`, d.error.student_id,`${d.error.error_message.student_id}`),
                id: 'student_id',
                disableFilter: true,
                disableSort: true
            },
            {
                Header: 'Name',
                // accessor: d => Array(`${d.name}`, false,``, true,`Name may be a duplicate`),
                accessor: d => Array(`${d.name}`, d.error.name,`${d.error.error_message.name}`,d.error.duplicate_name,`Name may be a duplicate in file import`),
                id: 'name',
                disableSort: true,
                // sortDirection: sort.accessor === 'name' ? sort.sortDirection : 'none'
            },
            {
                Header: 'Parent Email',
                // accessor: d => Array(`${d.email}`, true,`Email is invalid`, false,``),
                accessor: d => Array(`${d.parent_email}`,d.error.parent_email,`${d.error.error_message.parent_email}`,d.error.duplicate_parent_email,`Parent email is a duplicate in file import`),
                id: 'parent_email',
                disableSort: true
                // sortDirection: sort.accessor === 'email' ? sort.sortDirection : 'none'
            },
            {
                Header: 'School',
                // accessor: d => Array(`${d.phone_number}`,`${d.error.phone_number}`,`phone number invalid`),
                accessor: d => Array(`${d.school_name}`,d.error.school_name,`${d.error.error_message.school_name}`),
                disableFilter: true,
                id: 'school_name',
                disableSort: true
                // sortDirection: sort.accessor === 'phone_number' ? sort.sortDirection : 'none'
            },       
            {
                Header: 'Exclude?',
                accessor: 'exclude',
                disableFilter: true,
                id: 'exclude',
                disableSort: true,
                // sortDirection: sort.accessor === 'address' ? sort.sortDirection : 'none'
                Cell: ({ cell: { value } }) => (
                    <div className="mt-2 d-flex align-items-center justify-content-center">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" checked={value} id="flexCheckDefault" />
                        </div>
                    </div>
                    
                )
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
            origData={data}
            searchOn={false}
            // searchLabel="Search by name or email..."
            // ourGlobalFilterFunction={ourGlobalFilterFunction}
            // showAll={showAll}
            navUrl={"/students/"}
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
            // searchValue={searchValue}
            updateData={updateImportData}
        />
    )
}