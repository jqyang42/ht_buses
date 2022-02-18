import React, { useEffect, useState } from 'react';
import { useTable, useSortBy, usePagination, useFilters, useGlobalFilter } from 'react-table';
import { SORT, SORT_ASC, SORT_DESC } from "../../constants";
import { useNavigate } from "react-router-dom";
import SearchBar from './search-bar';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TablePagination from "./pagination";
import update from 'immutability-helper';

export function Table({ columns, data, searchOn, searchLabel, ourGlobalFilterFunction, showAll, navUrl, dnd, rowProps = () => ({}) }) {
    const navigate = useNavigate();

    const handleFilterInputChange = (e) => {
        // console.log(e.currentTarget);
        const { value } = e.currentTarget;
        setGlobalFilter(value);
    };

    const [records, setRecords] = useState(data)

    const getRowId = React.useCallback(row => {
        // console.log(row)
        return row.id
    }, [])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        nextPage,
        previousPage,
        state: { 
            pageIndex,
            pageSize
        },
        setGlobalFilter,
    } = useTable(
        {
        columns,
        data: dnd ? records : data,
        getRowId,
        globalFilter: ourGlobalFilterFunction,
        initialState: { 
            searchInput: "",
            pageIndex: 0,
            pageSize: 10,
            sortBy: dnd ? [] : [
                {
                    id: 'name',
                    desc: false
                }
            ]
        },
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination,
    )

    const moveRow = (dragIndex, hoverIndex) => {
        const dragRecord = records[dragIndex]
        const new_records = update(records, {
          $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, dragRecord],
          ],
        })
        // console.log(records)
        // records.map(row => {
        //     return row.id
        // })
        // console.log(new_records)
        setRecords(new_records)
    }

    // console.log(dnd)
    // console.log(searchOn)
    console.log(rows)

    return (
        <>
            { searchOn ?
            <SearchBar label={searchLabel} handleFilterInputChange={handleFilterInputChange} ourGlobalFilterFunction={ourGlobalFilterFunction} /> : "" }

            <DndProvider backend={HTML5Backend}>
            {/* // apply the table props */}
            <table {...getTableProps()} className="table table-striped table-hover">
                <thead>
                {// Loop over the header rows
                headerGroups.map(headerGroup => (
                    // Apply the header row props
                    <tr {...headerGroup.getHeaderGroupProps()}>
                    {dnd ? <th></th> : ""}
                    {// Loop over the headers in each row
                    headerGroup.headers.map(column => (
                        // Apply the header cell props
                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                        {// Render the header
                        column.render('Header')}
                        
                        {/* Column filter UI */}
                        {/* <div>{column.canFilter ? column.render('Filter') : null}</div> */}
                        
                        {/* Sorting UI */}
                        <span className="w-auto ms-2 me-0 float-right text-end">
                            {!column.disableSortBy ? (column.isSorted
                            ? column.isSortedDesc
                                ? <img src={SORT_DESC} className="img-icon"></img>
                                : <img src={SORT_ASC} className="img-icon"></img>
                            : <img src={SORT} className="img-icon"></img>) : ''}
                        </span>
                        </th>
                    ))}
                    </tr>
                ))}
                </thead>
                {/* Apply the table body props */}
                <tbody {...getTableBodyProps()}>
                {// Loop over the table rows
                showAll ? (dnd ? 
                rows.map((row, i) => 
                    // Prepare the row for display
                    prepareRow(row) || (
                        <Row
                        index={i}
                        row={row}
                        moveRow={moveRow}
                        navUrl={navUrl}
                        {...row.getRowProps(rowProps(row))}
                        />
                    )
                ) :
                rows.map((row, i) => {
                    // Prepare the row for display
                    prepareRow(row)
                    return (
                    <tr {...row.getRowProps(rowProps(row))} onClick={navUrl ? () => navigate(navUrl + row.original.id) : () => void 0}>
                        {row.cells.map(cell => {
                        return <td {...cell.getCellProps()}> {cell.render('Cell')}</td>
                        })}
                    </tr>
                    )
                })) : (dnd ? 
                page.map((row, i) => 
                    // Prepare the row for display
                    prepareRow(row) || (
                        <Row
                        index={i}
                        row={row}
                        moveRow={moveRow}
                        navUrl={navUrl}
                        {...row.getRowProps(rowProps(row))}
                        />
                    )
                ) :
                page.map((row, i) => {
                    // Prepare the row for display
                    prepareRow(row)
                    return (
                    <tr {...row.getRowProps(rowProps(row))} onClick={navUrl ? () => navigate(navUrl + row.original.id) : () => void 0}>
                        {row.cells.map(cell => {
                        return <td {...cell.getCellProps()}> {cell.render('Cell')}</td>
                        })}
                    </tr>
                    )
                }))}
                </tbody>
            </table>
            </DndProvider>

            {
                showAll ? "" :
                <TablePagination
                    pageIndex={pageIndex}
                    pageOptions={pageOptions}
                    previousPage={previousPage}
                    canPreviousPage={canPreviousPage}
                    nextPage={nextPage}
                    canNextPage={canNextPage}
                    pageSize={pageSize}
                    page={page}
                />
            }
        </>
    )
}

const DND_ITEM_TYPE = 'row'

const Row = ({ row, index, moveRow, navUrl }) => {
  const dropRef = React.useRef(null)
  const dragRef = React.useRef(null)
  const navigate = useNavigate();

  const [, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    hover(item, monitor) {
      if (!dropRef.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = dropRef.current.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      // Time to actually perform the action
      moveRow(dragIndex, hoverIndex)
      // console.log(row)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag, preview] = useDrag({
    type: DND_ITEM_TYPE,
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1

  preview(drop(dropRef))
  drag(dragRef)

  // console.log(row)

  return (
    // <tr ref={dropRef} style={{ opacity }}>
    //   <td ref={dragRef}><i className="bi bi-list me-2"></i></td>
    //   {row.cells.map(cell => {
    //     return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
    //   })}
    // </tr>
    <tr ref={dropRef} style={{ opacity }} {...row.getRowProps()} onClick={navUrl ? () => navigate(navUrl + row.original.id) : () => void 0}>
      <td ref={dragRef}><i className='bi bi-list'></i></td>
      {row.cells.map(cell => {
      return (<td {...cell.getCellProps()}>{cell.render('Cell')}</td>)}
      )}
    </tr>
  )
}