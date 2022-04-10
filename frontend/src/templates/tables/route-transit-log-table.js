import React, { useCallback, useEffect } from "react";
import { Table } from "./table";
import { colors } from "../../static/colors";
import { toDisplayFormat } from "../components/time";
import { useState } from "react";
    
export function RouteTransitLogTable({ data, showAll, pageIndex, canPreviousPage, canNextPage, 
    updatePageCount, pageSize, totalPages, searchValue}) {

    const [sort, setSort] = useState({ sortDirection: 'DESC', accessor: 'start_time' });

    useEffect(() => {
        updatePageCount(pageIndex, sort, searchValue)
    }, [sort])

    const columns = React.useMemo(
        () => [
            {
                Header: 'Driver',
                accessor: d => Array(`${d.user.first_name} ${d.user.last_name}`, `${d.user.id}`),
                id: 'user',
                Cell: ({ cell: { value } }) => (
                    <a href={"/users/" + value[1]}>{value[0]}</a>
                ),
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
                accessor: d => Array(`${d.school.name}`, `${d.school.id}`),
                id: 'school',
                disableFilter: true,
                Cell: ({ cell: { value } }) => (
                    <a href={"/schools/" + value[1]}>{value[0]}</a>
                ),
                sortDirection: sort.accessor === 'school' ? sort.sortDirection : 'none'
            },
            // {
            //     Header: 'Route',
            //     accessor: d => Array(`${d.route.color_id}`,`${d.route.id}`, `${d.route.id != 0 ? d.route.name : ''}`),
            //     disableFilter: true,
            //     id: 'route',
            //     Cell: ({ cell: { value } }) => (
            //         value[1] == 0 ? <><div className="unassigned">{"Unassigned"}</div></> : <><span className={"circle me-2"} style={{backgroundColor: colors[value[0]]}}/><a href={'/routes/'+value[1]}>{value[2]}</a></>
            //     ),
            //     sortDirection: sort.accessor === 'route' ? sort.sortDirection : 'none'
            // },     
            {
                Header: 'Direction',
                accessor: 'pickup',
                disableFilter: true,
                id: 'direction',
                disableSortBy: true,
                Cell: ({ cell: { value } }) => (
                    value ? <div>{"Pickup"}</div> : <div>{"Dropoff"}</div>
                ),
                sortDirection: sort.accessor === 'direction' ? sort.sortDirection : 'none'
            },     
            {
                Header: 'Start Time',
                accessor: d => Array(`${d.date}`,`${d.start_time}`),
                id: 'start_time',
                Cell: ({ cell: { value } }) => (
                    value[0] + " " + toDisplayFormat({ twentyfour_time: value[1] })
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
            searchLabel="Search by bus number, driver, or school..."
            showAll={showAll}
            // navUrl={"/routes/"}
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
