import React, { useCallback } from "react";  
import { Table } from "./table";

export function StopsTable({ data, showAll }) {

    const columns = React.useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'name',
                disableSortBy: true
            },
            {
                Header: 'Pickup Time',
                accessor: 'arrival',
                disableFilter: true,
                disableSortBy: true
            },
            {
                Header: 'Dropoff Time',
                accessor: 'departure',
                disableFilter: true,
                disableSortBy: true
            }
        ],
        []
    )

    return (
        <Table 
            columns={columns}
            data={data}
            searchOn={false}
            showAll={showAll}
            dnd={true}
            rowProps={row => ({
                style: {
                    cursor: "pointer"
                }
            })}
        />
    )
}