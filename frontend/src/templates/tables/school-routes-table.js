import React from "react";
import { Table } from "./table";
    
export function SchoolRoutesTable({ data, showAll }) {

    const columns = React.useMemo(
        () => [
            // {
            //     Header: '#',
            //     accessor: 'id', // accessor is the "key" in the data
            //     disableSortBy: true
            // },
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Student Count',
                accessor: 'student_count',
            },
            {
                Header: 'Status',
                accessor: 'status',
                className: 'unassigned'
            },
        ],
        []
    )

    return (
        <Table columns={columns} data={data} searchOn={false} showAll={showAll} navUrl={"/routes/"}/>
    )
}