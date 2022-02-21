import React, { useCallback } from "react";  
import { Table } from "./table";
import { toDisplayFormat } from "../components/time";

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
                disableSortBy: true,
                Cell: ({ cell: { value } }) => (
                    toDisplayFormat({ twentyfour_time: value })
                )
            },
            {
                Header: 'Dropoff Time',
                accessor: 'departure',
                disableFilter: true,
                disableSortBy: true,
                Cell: ({ cell: { value } }) => (
                    toDisplayFormat({ twentyfour_time: value })
                )
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
            hasCustomSortBy={true}
            customSortBy={[{
                id: 'arrival',
                desc: false
            }]}
        />
    )
}