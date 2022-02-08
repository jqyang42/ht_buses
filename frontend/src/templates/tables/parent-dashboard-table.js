import React, { useCallback } from "react";
import { Table } from "./table";
    
export function ParentDashboardTable({ data, showAll }) {

    // Filter by multiple columns
    const ourGlobalFilterFunction = useCallback(
        (rows, ids, query) => {
            return rows.filter((row) => 
                row.values["id"].toString().includes(query.toString()) ||
                row.values["name"].toLowerCase().includes(query.toLowerCase())
            );
        },
        [],
    );

    const columns = React.useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'student_school_id',
                id: 'id', // accessor is the "key" in the data
            },
            {
                Header: 'Name',
                accessor: d => `${d.first_name} ${d.last_name}`,
                id: 'name',
            },
            {
                Header: 'School',
                accessor: 'school_name',
                disableFilter: true
            },
            {
                Header: 'Bus Route',
                accessor: 'route_name',
                disableFilter: true
            },            
        ],
        []
    )

    return (
        <Table columns={columns} data={data} searchOn={true} searchLabel="Search by id or name..." ourGlobalFilterFunction={ourGlobalFilterFunction} showAll={showAll} navUrl={"/dashboard/"}/>
    )
}