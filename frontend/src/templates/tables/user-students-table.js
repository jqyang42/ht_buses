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
                accessor: d => Array(`${d.route.color_id}`,`${d.route.id}`, `${d.route.id ? d.route.name : ''}`),
                Cell: ({ cell: { value } }) => (
                    value[1] == 0 ? <><div className="unassigned">{"Unassigned"}</div></> : <><span className={"circle me-2"} style={{backgroundColor: colors[value[0]]}}/>{value[2]}</>
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