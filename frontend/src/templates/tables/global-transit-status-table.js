import React, { useCallback, useEffect } from "react";
import { Table } from "./table";
import { colors } from "../../static/colors";
import { useState } from "react";
    
export function GlobalTransitStatusTable({ data, showAll, pageIndex, canPreviousPage, canNextPage, 
    updatePageCount, pageSize, totalPages, searchValue}) {

    const [sort, setSort] = useState({ sortDirection: 'ASC', accessor: 'full_name' });

    useEffect(() => {
        updatePageCount(pageIndex, sort, searchValue)
    }, [sort])

    const columns = React.useMemo(
        () => [
            {
                Header: 'School',
                accessor: d => Array(`${d.school.name}`,`${d.school.id}`),
                disableFilter: true,
                id: 'school',
                Cell: ({ cell: { value } }) => (
                    <a href={"/schools/"+value[1]}>{value[0]}</a>
                ),
                sortDirection: sort.accessor === 'school' ? sort.sortDirection : 'none'
            },
            {
                Header: 'Route',
                accessor: d => Array(`${d.route.color_id}`,`${d.route.id}`, `${d.route.id != 0 ? d.route.name : ''}`),
                disableFilter: true,
                id: 'route',
                Cell: ({ cell: { value } }) => (
                    value[1] == 0 ? <><div className="unassigned">{"Unassigned"}</div></> : <><span className={"circle me-2"} style={{backgroundColor: colors[value[0]]}}/><a href={"/routes/"+value[1]}>{value[2]}</a></>
                ),
                sortDirection: sort.accessor === 'route' ? sort.sortDirection : 'none'
            }, 
            {
                Header: 'Bus #',
                accessor: 'bus_number',
                id: 'bus_number',
                sortDirection: sort.accessor === 'bus_number' ? sort.sortDirection : 'none'
            },
            {
                Header: 'Driver',
                accessor: d => `${d.user.first_name} ${d.user.last_name}`,
                id: 'user',
                sortDirection: sort.accessor === 'user' ? sort.sortDirection : 'none'
            }
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
            searchOn={false}
            // searchLabel="Search by bus number, driver, school or route..."
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