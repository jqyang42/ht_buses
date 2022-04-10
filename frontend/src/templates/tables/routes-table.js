import React, { useCallback, useEffect } from "react";  
import { colors } from "../../static/colors";
import { Table } from "./table";
import { useState } from "react";

export function RoutesTable({ data, showAll, pageIndex, canPreviousPage, canNextPage, 
    updatePageCount, pageSize, totalPages, searchValue }) {

    const [sort, setSort] = useState({ sortDirection: 'ASC', accessor: 'name' });

    useEffect(() => {
        updatePageCount(pageIndex, sort, searchValue)
    }, [sort])

    const columns = React.useMemo(
        () => [
            {
                Header: 'Name',
                accessor: d => Array(`${d.color_id}`,`${d.name}`),
                Cell: ({ cell: { value } }) => (
                    <><span className={"circle me-2"} style={{backgroundColor: colors[value[0]]}}/>{value[1]}</>
                ),
                id: 'name',
                sortDirection: sort.accessor === 'name' ? sort.sortDirection : 'none'
            },
            {
                Header: 'School',
                accessor: 'school_name.name',
                disableFilter: true,
                id: 'school',
                sortDirection: sort.accessor === 'school' ? sort.sortDirection : 'none'
            },
            {
                Header: 'Student Count',
                accessor: 'student_count',
                disableFilter: true,
                id: 'student_count',
                sortDirection: sort.accessor === 'student_count' ? sort.sortDirection : 'none',
                disableSortBy: true
            },
            {
                Header: 'Status',
                accessor:  'is_complete',
                disableFilter: true,
                Cell: ({ cell: { value } }) => (
                    value ? <>{"Complete"}</> : <div className="unassigned">{"Incomplete"}</div>
                ),
                id: 'is_complete',
                sortDirection: sort.accessor === 'is_complete' ? sort.sortDirection : 'none'
            },
            {
                Header: 'Bus Run',
                accessor:  d => Array(`${d.in_transit}`,`${d.bus_number}`,`${d.driver}`),
                disableFilter: true,
                Cell: ({ cell: { value } }) => (
                    value[0] ? <>{"None in transit"}</> : <>{"Driver " + value[2] + " on bus #" + value[1]}</>
                ),
                disableSortBy: true,
                // id: 'is_complete',
                // sortDirection: sort.accessor === 'is_complete' ? sort.sortDirection : 'none'
            },
        ],
        [sort]
    )

    const columnHeaderClick = async (column) => {
        switch (column.sortDirection) {
          case 'none':
            setSort({ sortDirection: 'ASC', accessor: column.id });
            break;
          case 'ASC':
            setSort({ sortDirection: 'DESC', accessor: column.id });
            break;
          case 'DESC':
            setSort({ sortDirection: 'none', accessor: column.id });
            break;
        }
    };

    return (
        <Table
            columns={columns}
            data={data}
            searchOn={true}
            searchLabel="Search by name..."
            showAll={showAll}
            navUrl={"/routes/"}
            rowProps={row => ({
                style: {
                    cursor: "pointer"
                }
            })}
            pageIndex={pageIndex}
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
            updatePageCount={updatePageCount}
            pageSize={pageSize}
            totalPages={totalPages}
            columnHeaderClick={columnHeaderClick}
            sortOptions={sort}
            searchValue={searchValue}
        />
    )
}