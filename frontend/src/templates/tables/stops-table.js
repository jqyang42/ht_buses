import React, { useCallback } from "react";  
import { Table } from "./table";

export function StopsTable({ data, showAll, dnd, handleReorder }) {

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
            dnd={dnd}
            rowProps={row => ({
                style: {
                    cursor: "pointer"
                }
            })}
            handleReorder={handleReorder}
        />
    )
}