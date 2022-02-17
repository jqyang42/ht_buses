import React from "react";
import { Table } from "./table";
import { colors } from "../../static/colors";
    
export function UserStudentsTable({ data, showAll }) {

    const columns = React.useMemo(
        () => [
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
                accessor: d => Array(`${d.color_id}`,`${d.route_name}`),
                Cell: ({ cell: { value } }) => (
                    value[1] === "Unassigned" ? <><div className="unassigned">{value[1]}</div></> : <><span className={"circle me-2"} style={{backgroundColor: colors[value[0]]}}/>{value[1]}</>
                ),
            },     
            {
                Header: 'Bus Stops',
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
        <Table
            columns={columns}
            data={data}
            searchOn={false}
            showAll={showAll}
            navUrl={"/students/"}
            rowProps={row => ({
                style: {
                    cursor: "pointer"
                }
            })}
        />
    )
}