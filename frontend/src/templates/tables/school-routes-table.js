import React from "react";
import { TableOld } from "./table-old";
    
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
                disableSortBy: true
            },
            {
                Header: 'Student Count',
                accessor: 'student_count',
                disableSortBy: true
            },
            {
                Header: 'Status',
                accessor: 'is_complete',
                disableFilter: true,
                disableSortBy: true,
                Cell: ({ cell: { value } }) => (
                    value ? <>{"Complete"}</> : <div className="unassigned">{"Incomplete"}</div>
                )
            },
        ],
        []
    )

    return (
        <TableOld
            columns={columns}
            data={data}
            searchOn={false}
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