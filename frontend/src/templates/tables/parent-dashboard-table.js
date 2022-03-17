import React, { useCallback, useEffect, useState } from "react";
import { Table } from "./table";
import { colors } from "../../static/colors";
    
export function ParentDashboardTable({ data, showAll, pageIndex, canPreviousPage, canNextPage, 
    updatePageCount, pageSize, totalPages, searchValue }) {

    const [sort, setSort] = useState({ sortDirection: 'ASC', accessor: 'name' });
    // const [sort, setSort] = useState({ sortDirection: '', accessor: '' });   for default no sort

    useEffect(() => {
        updatePageCount(pageIndex, sort, searchValue)
    }, [sort])

    // Filter by multiple columns
    // const ourGlobalFilterFunction = useCallback(
    //     (rows, ids, query) => {
    //         return rows.filter((row) => 
    //             row.values["id"].toString().includes(query.toString()) ||
    //             row.values["name"].toLowerCase().includes(query.toLowerCase())
    //         );
    //     },
    //     [],
    // );

    const columns = React.useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'student_school_id',
                id: 'id', // accessor is the "key" in the data
                sortDirection: sort.accessor === 'id' ? sort.sortDirection : 'none'
            },
            {
                Header: 'Name',
                accessor: d => `${d.first_name} ${d.last_name}`,
                id: 'name',
                sortDirection: sort.accessor === 'name' ? sort.sortDirection : 'none'
            },
            {
                Header: 'School',
                accessor: 'school_name',
                disableFilter: true,
                id: 'school_name',
                sortDirection: sort.accessor === 'school_name' ? sort.sortDirection : 'none'
            },
            {
                Header: 'Bus Route',
                accessor: d => Array(`${d.route.color_id}`,`${d.route.id}`, `${d.route.id != 0 ? d.route.name : ''}`),
                disableFilter: true,
                Cell: ({ cell: { value } }) => (
                    value[1] == 0 ? <><div className="unassigned">{"Unassigned"}</div></> : <><span className={"circle me-2"} style={{backgroundColor: colors[value[0]]}}/>{value[2]}</>
                ),
                id: 'route',
                sortDirection: sort.accessor === 'route' ? sort.sortDirection : 'none'
            },            
        ],
        [sort]
        // []
    )

    const columnHeaderClick = async (column) => {
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
            console.log(sort)
            // setData(asc);
            break;
          case 'DESC':
            setSort({ sortDirection: 'none', accessor: column.id });
            // const newData = await getClients('none', column.id);
            // setData(newData);
            console.log(sort)
            break;
        }
    };

    return (
        <Table
            columns={columns}
            data={data}
            searchOn={true}
            searchLabel="Search by id or name..."
            // ourGlobalFilterFunction={ourGlobalFilterFunction}
            showAll={showAll}
            navUrl={"/dashboard/"}
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
        />
    )
}