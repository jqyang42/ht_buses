import React, { useCallback, useEffect } from "react";
import { Table } from "./table";
import { colors } from "../../static/colors";
import { toDisplayFormat } from "../components/time";
import { useState } from "react";
    
export function TransitLogTable({ data, showAll, pageIndex, canPreviousPage, canNextPage, 
    updatePageCount, pageSize, totalPages, searchValue}) {

    const [sort, setSort] = useState({ sortDirection: 'ASC', accessor: 'name' });

    useEffect(() => {
        updatePageCount(pageIndex, sort, searchValue)
    }, [sort])

    const columns = React.useMemo(
        () => [
            {
                Header: 'Driver',
                accessor: d => `${d.user.first_name} ${d.user.last_name}`,
                id: 'user',
                sortDirection: sort.accessor === 'user' ? sort.sortDirection : 'none'
            },
            {
                Header: 'Bus #',
                accessor: 'bus_number',
                id: 'bus_number',
                sortDirection: sort.accessor === 'bus_number' ? sort.sortDirection : 'none'
            },
            {
                Header: 'School',
                accessor: 'school_name',
                id: 'school_name',
                disableFilter: true,
                sortDirection: sort.accessor === 'school_name' ? sort.sortDirection : 'none'
            },
            // {
            //     Header: 'Route',
            //     accessor: d => Array(`${d.route.color_id}`,`${d.route.id}`, `${d.route.id != 0 ? d.route.name : ''}`),
            //     disableFilter: true,
            //     id: 'route',
            //     Cell: ({ cell: { value } }) => (
            //         value[1] == 0 ? <><div className="unassigned">{"Unassigned"}</div></> : <><span className={"circle me-2"} style={{backgroundColor: colors[value[0]]}}/>{value[2]}</>
            //     ),
            //     sortDirection: sort.accessor === 'route' ? sort.sortDirection : 'none'
            // },     
            {
                Header: 'Direction',
                accessor: 'pickup',
                disableFilter: true,
                id: 'direction',
                Cell: ({ cell: { value } }) => (
                    value ? <div>{"To school"}</div> : <div>{"From school"}</div>
                ),
                sortDirection: sort.accessor === 'direction' ? sort.sortDirection : 'none'
            },     
            {
                Header: 'Start Time',
                accessor: 'start_time',
                id: 'start_time',
                // @jessica use to format time when in 24 hour format
                Cell: ({ cell: { value } }) => (
                    toDisplayFormat({ twentyfour_time: value })
                ),
                disableFilter: true,
                sortDirection: sort.accessor === 'start_time' ? sort.sortDirection : 'none'
            },
            {
                Header: 'Duration',
                accessor: 'duration',
                id: 'duration',
                Cell: ({ cell: { value } }) => (
                    value === "00:00" ? <div>{"Ongoing"}</div> : <div>{value}</div>
                ),
                disableFilter: true,
                sortDirection: sort.accessor === 'duration' ? sort.sortDirection : 'none'
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
            searchLabel="Search by bus number, driver, school or route..."
            showAll={showAll}
            // navUrl={"/students/"}
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