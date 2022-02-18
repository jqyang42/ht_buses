import React, { useCallback } from "react";  
import { Table } from "./table";

export function StopsTable({ data, showAll }) {

    const columns = React.useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Pickup Time',
                accessor: 'arrival',
                disableFilter: true
            },
            {
                Header: 'Dropoff Time',
                accessor: 'departure',
                disableFilter: true
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
            rowProps={row => ({
                style: {
                    cursor: "pointer"
                }
            })}
        />
    )
}