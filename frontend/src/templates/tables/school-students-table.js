import React from "react";
import { colors } from "../../static/colors";
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
                Cell: ({ cell: { value } }) => (
                    value === "Unassigned" ? <><div className="unassigned">{value}</div></> : <><span className="circle me-2" />{value}</>
                )
            },     
            {
                Header: 'Bus Stop',
                accessor: 'in_range',
                disableFilter: true,
                Cell: ({ cell: { value } }) => (
                    value ? <>{"In Range"}</> : <><div className="unassigned">{"Out of Range"}</div></>
                )
            },
        ],
        []
    )

    return (
        <Table columns={columns} data={data} searchOn={false} showAll={showAll} navUrl={"/students/"}/>
    )
}