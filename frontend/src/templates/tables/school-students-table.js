import React, { useEffect } from "react";
import { colors } from "../../static/colors";
import { Table } from "./table";
import { useState } from "react";
    
export function SchoolStudentsTable({ data, showAll, pageIndex, canPreviousPage, canNextPage, 
    updatePageCount, pageSize, totalPages, searchValue }) {

    const columns = React.useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'student_school_id', // accessor is the "key" in the data
                id: 'student_school_id',
                // sortDirection: sort.accessor === 'student_school_id' ? sort.sortDirection : 'none',
                disableSortBy: true
            },
            {
                Header: 'Name',
                accessor: d => `${d.first_name} ${d.last_name}`,
                id: 'name',
                // sortDirection: sort.accessor === 'name' ? sort.sortDirection : 'none',
                disableSortBy: true
            },
            {
                Header: 'Bus Route',
                accessor: d => Array(`${d.route.color_id}`,`${d.route.id}`, `${d.route.id != 0 ? d.route.name : ''}`),
                disableSortBy: true,
                Cell: ({ cell: { value } }) => (
                    value[1] == 0 ? <><div className="unassigned">{"Unassigned"}</div></> : <><span className={"circle me-2"} style={{backgroundColor: colors[value[0]]}}/>{value[2]}</>
                ),
                id: 'route',
                // sortDirection: sort.accessor === 'route' ? sort.sortDirection : 'none'
            },     
            {
                Header: 'Bus Stops',
                accessor: 'in_range',
                disableFilter: true,
                disableSortBy: true,
                Cell: ({ cell: { value } }) => (
                    value ? <>{"In Range"}</> : <><div className="unassigned">{"Out of Range"}</div></>
                ),
                id: 'in_range',
                // sortDirection: sort.accessor === 'in_range' ? sort.sortDirection : 'none'
            },
        ],
        // [sort]
        []
    )

    // const columnHeaderClick = async (column) => {

    //     switch (column.sortDirection) {
    //       case 'none':
    //         // console.log(column.sortDirection)
    //         // console.log(column.id)
    //         setSort({ sortDirection: 'ASC', accessor: column.id });
    //         // const desc = await getClients( 'ASC', column.id );
    //         // setData(desc);
    //         console.log(sort)
    //         break;
    //       case 'ASC':
    //         setSort({ sortDirection: 'DESC', accessor: column.id });
    //         // const asc = await getClients('DESC', column.id);
    //         console.log(sort)
    //         // setData(asc);
    //         break;
    //       case 'DESC':
    //         setSort({ sortDirection: 'none', accessor: column.id });
    //         // const newData = await getClients('none', column.id);
    //         // setData(newData);
    //         console.log(sort)
    //         break;
    //     }
    // };

    return (
        <Table
            columns={columns}
            data={data}
            searchOn={false}
            showAll={showAll}
            navUrl={"/students/"}
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
            // columnHeaderClick={columnHeaderClick}
            sortOptions={null}
            searchValue={''}
        />
    )
}