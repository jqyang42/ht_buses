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
                accessor: 'pickup_time',
                disableFilter: true
            },
            {
                Header: 'Dropoff Time',
                accessor: 'dropoff_time',
                disableFilter: true
            }
        ],
        []
    )

    return (
        <Table columns={columns} data={data} searchOn={false} showAll={showAll}/>
    )
}