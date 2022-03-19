import React, { useCallback, useEffect } from "react";
import { toDisplayFormat } from "../components/time";
import { Table } from "./table";
import { useState } from "react";
    
export function ManagedSchoolsTable({ data, showAll, pageIndex, canPreviousPage, canNextPage,
    updatePageCount, pageSize, totalPages, searchValue }) {

    const [sort, setSort] = useState({ sortDirection: 'ASC', accessor: 'name' });
    
    useEffect(() => {
        updatePageCount(pageIndex, sort, searchValue)
    }, [sort])

    // Filter by multiple columns
    // const ourGlobalFilterFunction = useCallback(
    //     (rows, ids, query) => {
    //         return rows.filter((row) => 
    //             row.values["name"].toLowerCase().includes(query.toLowerCase())
    //         );
    //     },
    //     [],
    // );

    const columns = React.useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'name',
                id: 'name',
                sortDirection: sort.accessor === 'name' ? sort.sortDirection : 'none'
            },
        ],
        [sort]
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
            searchOn={false}
            // searchLabel="Search by name..."
            // ourGlobalFilterFunction={ourGlobalFilterFunction}
            showAll={showAll}
            navUrl={"/schools/"}
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