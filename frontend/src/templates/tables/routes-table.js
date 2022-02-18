import React, { useCallback } from "react";  
import { colors } from "../../static/colors";
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
            // {
            //     Header: 'Color',
            //     accessor: 'color_id',
            //     disableSortBy: true,
            //     Cell: ({ cell: { value } }) => (
            //         <><span className={"circle me-2"} style={{backgroundColor: colors[value]}}/></>
            //     )
            // },
            {
                Header: 'Name',
                // accessor: 'name',
                accessor: d => Array(`${d.color_id}`,`${d.name}`),
                Cell: ({ cell: { value } }) => (
                    <><span className={"circle me-2"} style={{backgroundColor: colors[value[0]]}}/>{value[1]}</>
                )
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
                disableFilter: true,
                Cell: ({ cell: { value } }) => (
                    value ? <>{"Complete"}</> : <div className="unassigned">{"Incomplete"}</div>
                )
            },
        ],
        []
    )

    return (
        <Table
            columns={columns}
            data={data}
            searchOn={true}
            searchLabel="Search by name..."
            ourGlobalFilterFunction={ourGlobalFilterFunction}
            showAll={showAll}
            navUrl={"/routes/"}
            rowProps={row => ({
                style: {
                    cursor: "pointer"
                }
            })}
        />
    )
}