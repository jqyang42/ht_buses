import React from "react";
import { Table } from "./table";
    
export function SchoolStudentsTable({ data, showAll }) {

    const columns = React.useMemo(
        () => [
            // {
            //     Header: '#',
            //     accessor: d => `${d.id}`, // accessor is the "key" in the data
            //     id: 'id',
            //     disableSortBy: true
            // },
            {
                Header: 'ID',
                accessor: 'student_school_id', // accessor is the "key" in the data
            },
            {
                Header: 'Name',
                accessor: d => `${d.first_name} ${d.last_name}`,
                id: 'name'
            },
            {
                Header: 'Bus Route',
                accessor: 'route_name',
                className: 'unassigned'
            },
        ],
        []
    )

    return (
        <Table columns={columns} data={data} searchOn={false} showAll={showAll} navUrl={"/students/"}/>
    )
}