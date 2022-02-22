import React, { useCallback } from "react";
import { Table } from "./table";
import { colors } from "../../static/colors";
import { useState } from "react";
    
export function StudentsTable( {data, showAll, pageIndex, canPreviousPage, canNextPage, updatePageCount, pageSize, totalPages} ) {

    const [sort, setSort] = useState({ sortDirection: 'ASC', accessor: 'name' });
    
    // Filter by multiple columns
    const ourGlobalFilterFunction = useCallback(
        (rows, ids, query) => {
            return rows.filter((row) => 
                row.values["student_school_id"].toString().includes(query.toString()) ||
                row.values["name"].toLowerCase().includes(query.toLowerCase())
            );
        },
        [],
    );

    const columns = React.useMemo(
        () => [
            // {
            //     Header: '#',
            //     accessor: d => `${d.id}`, // accessor is the "key" in the data
            //     id: 'id',
            //     disableFilter: true,
            //     disableSortBy: true
            // },
            {
                Header: 'ID',
                accessor: 'student_school_id',
                id: 'student_school_id'
            },
            {
                Header: 'Name',
                accessor: d => `${d.first_name} ${d.last_name}`,
                id: 'name',
                sortType: 'basic',
                // sortDirection: sort.accessor === 'name' ? sort.direction : 'none'
                sortDirection: 'none'
            },
            
            {
                Header: 'School',
                accessor: 'school_name',
                disableFilter: true,
            },
            {
                Header: 'Route',
                accessor: d => Array(`${d.route.color_id}`,`${d.route.id}`, `${d.route.id != 0 ? d.route.name : ''}`),
                disableFilter: true,
                Cell: ({ cell: { value } }) => (
                    value[1] == 0 ? <><div className="unassigned">{"Unassigned"}</div></> : <><span className={"circle me-2"} style={{backgroundColor: colors[value[0]]}}/>{value[2]}</>
                ),
            },     
            {
                Header: 'Bus Stops',
                accessor: 'in_range',
                disableFilter: true,
                Cell: ({ cell: { value } }) => (
                    value ? <>{"In Range"}</> : <><div className="unassigned">{"Out of Range"}</div></>
                )
            },     
            {
                Header: 'Parent Name',
                accessor: d => `${d.parent.first_name} ${d.parent.last_name}`,
                disableFilter: true
            },
        ],
        []
    )

    const columnHeaderClick = async (column) => {
        console.log("column header click reached")
        console.log(column)
        // if (column.isSorted) {
        //     console.log(column.id)
        //     console.log("asc")
        // } else if (column.isSortedDesc) {
        //     console.log(column.id)
        //     console.log("desc")
        // } else {
        //     console.log("none")
        // }
        switch (column.sortDirection) {
          case 'none':
            // console.log(column.sortDirection)
            // console.log(column.id)
            setSort({ sortDirection: 'ASC', accessor: column.id });
            // const desc = await getClients( 'ASC', column.id );
            // setData(desc);
            console.log(sort)
            break;
          case 'ASC':
            setSort({ sortDirection: 'DESC', accessor: column.id });
            // const asc = await getClients('DESC', column.id);
            // setData(asc);
            break;
          case 'DESC':
            setSort({ sortDirection: 'none', accessor: column.id });
            // const newData = await getClients('none', column.id);
            // setData(newData);
            break;
        }
    };
         
    return (
        <Table
            columns={columns}
            data={data}
            searchOn={true}
            searchLabel="Search by id or name..."
            ourGlobalFilterFunction={ourGlobalFilterFunction}
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
            columnHeaderClick={columnHeaderClick}
        />
    )
}