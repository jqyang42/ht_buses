import React, { useCallback } from "react";
import { Table } from "./table";
import { colors } from "../../static/colors";
    
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
                accessor: d => Array(`${d.route.color_id}`,`${d.route.id}`, `${d.route.id != 0 ? d.route.name : ''}`),
                disableFilter: true,
                Cell: ({ cell: { value } }) => (
                    value[1] == 0 ? <><div className="unassigned">{"Unassigned"}</div></> : <><span className={"circle me-2"} style={{backgroundColor: colors[value[0]]}}/>{value[2]}</>
                ),
            },            
        ],
        []
    )

    return (
        <Table
            columns={columns}
            data={data}
            searchOn={true}
            searchLabel="Search by id or name..."
            ourGlobalFilterFunction={ourGlobalFilterFunction}
            showAll={showAll}
            navUrl={"/dashboard/"}
            rowProps={row => ({
                style: {
                    cursor: "pointer"
                }
            })}
        />
    )
}