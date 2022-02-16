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
                accessor:  'is_complete',
                // accessor: 'is_complete',
                disableFilter: true,
                Cell: ({ cell: { value } }) => (
                    value ? <>{"Complete"}</> : <div className="unassigned">{"Incomplete"}</div>
                )
            },
        ],
        []
    )

    return (
        <Table columns={columns} data={data} searchOn={true} searchLabel="Search by name..." ourGlobalFilterFunction={ourGlobalFilterFunction} showAll={showAll} navUrl={"/routes/"}/>
    )
}