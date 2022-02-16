import React, { useCallback } from "react";
import { Table } from "./table";
    
export function StudentsTable( {data, showAll} ) {
    
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
                id: 'name'
            },
            
            {
                Header: 'School',
                accessor: 'school_name',
                disableFilter: true,
            },
            {
                Header: 'Route',
                accessor: 'route_name',
                disableFilter: true,
                className: 'unassigned',
                Cell: ({ cell: { value } }) => (
                    value === "Unassigned" || value === "Out of Range" ? <>{value}</> : <><span className="circle me-2" />{value}</>
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
         
    return (
        <Table columns={columns} data={data} searchOn={true} searchLabel="Search by id or name..." ourGlobalFilterFunction={ourGlobalFilterFunction} showAll={showAll} navUrl={"/students/"}/>
    )
}