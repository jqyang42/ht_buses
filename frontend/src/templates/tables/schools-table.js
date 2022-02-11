import React, { useCallback } from "react";
import { Table } from "./table";
    
export function SchoolsTable({ data, showAll }) {

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
                Header: 'Address',
                accessor: 'address',
                disableFilter: true
            },
            {
                Header: 'Bus Arrival Time',
                accessor: 'arrival_time',
                disableFilter: true
            },
            {
                Header: 'Bus Departure Time',
                accessor: 'departure_time',
                disableFilter: true
            },
        ],
        []
    )

    return (
        <Table columns={columns} data={data} searchOn={true} searchLabel="Search by name..." ourGlobalFilterFunction={ourGlobalFilterFunction} showAll={showAll} navUrl={"/schools/"}/>
    )
}