import React, { useCallback } from "react";  
import { Table } from "./table";

export function RoutesTable({ data, showAll }) {

    // Filter by multiple columns
    const ourGlobalFilterFunction = useCallback(
        (rows, ids, query) => {
            return rows.filter((row) => 
                row.values["name"].toLowerCase().includes(query.toLowerCase())
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
                accessor: 'name',
            },
            {
                Header: 'School',
                accessor: 'school_name.name',
                disableFilter: true
            },
            {
                Header: 'Student Count',
                accessor: 'student_count',
                disableFilter: true
            },
            {
                Header: 'Status',
                accessor: 'status',
                disableFilter: true,
                className: 'unassigned'
            },
        ],
        []
    )

    return (
        <Table columns={columns} data={data} searchOn={true} searchLabel="Search by name..." ourGlobalFilterFunction={ourGlobalFilterFunction} showAll={showAll} navUrl={"/routes/"}/>
    )
}