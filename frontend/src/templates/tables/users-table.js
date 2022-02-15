import React, { useCallback } from "react";
import { Table } from "./table";
    
export function UsersTable({ data, showAll }) {

    // Filter by multiple columns
    const ourGlobalFilterFunction = useCallback(
        (rows, ids, query) => {
            return rows.filter((row) => 
                row.values["name"].toLowerCase().includes(query.toLowerCase()) ||
                row.values["email"].toLowerCase().includes(query.toLowerCase())
            );
        },
        [],
    );

    const columns = React.useMemo(
        () => [
            // {
            //     Header: '#',
            //     accessor: 'id', // accessor is the "key" in the data
            //     disableSortBy: true,
            //     disableFilter: true
            // },
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
                disableFilter: true
            },            
            {
                Header: 'Address',
                accessor: 'location.address',
                disableFilter: true
            },
        ],
        []
    )

    return (
        <Table columns={columns} data={data} searchOn={true} searchLabel="Search by name or email..." ourGlobalFilterFunction={ourGlobalFilterFunction} showAll={showAll} navUrl={"/users/"}/>
    )
}