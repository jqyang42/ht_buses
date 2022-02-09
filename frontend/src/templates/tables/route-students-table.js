import React from "react";
import { Table } from "./table";
    
export function RouteStudentsTable({ data, showAll }) {

    const columns = React.useMemo(
        () => [
            // {
            //     Header: '#',
            //     accessor: d => `${d.id}`, // accessor is the "key" in the data
            //     id: 'id',
            //     disableSortBy: true
            // },
            {
                Header: 'Student ID',
                accessor: 'student_school_id', // accessor is the "key" in the data
            },
            {
                Header: 'Name',
                accessor: d => `${d.first_name} ${d.last_name}`,
                id: 'name'
            }
        ],
        []
    )

    return (
        <Table columns={columns} data={data} searchOn={false} showAll={showAll} navUrl={"/students/"}/>
    )
}