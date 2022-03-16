import React, { useEffect, useState } from 'react';
import { useTable, useSortBy, usePagination, useFilters, useGlobalFilter } from 'react-table';
import { SORT, SORT_ASC, SORT_DESC } from "../../constants";
import { useNavigate } from "react-router-dom";
import SearchBar from './search-bar';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TablePagination from "./pagination";
import update from 'immutability-helper';

export function TableEditable({ columns, data, searchOn, searchLabel, ourGlobalFilterFunction, showAll, navUrl, dnd, handleReorder, hasCustomSortBy, customSortBy, rowProps = () => ({}), pageIndex, canPreviousPage, canNextPage, updatePageCount, pageSize, totalPages, columnHeaderClick, sortOptions, searchValue, editable }) {

    const navigate = useNavigate();

    const handleFilterInputChange = (e) => {
        console.log(e.currentTarget.value);
        searchValue = e.currentTarget.value;
        updatePageCount(pageIndex, sortOptions, searchValue)
    };

    // const [records, setRecords] = useState(data)
    const [editedData, setData] = useState(data)
    const [originalData] = useState(data)
    const [skipPageReset, setSkipPageReset] = React.useState(false)

    // useEffect(() => {
    //     setRecords(data)
    //     console.log(data)
    // }, [data])

    // We need to keep the table from resetting the pageIndex when we
    // Update data. So we can keep track of that flag with a ref.

    // When our cell renderer calls updateMyData, we'll use
    // the rowIndex, columnId and new value to update the
    // original data
    const updateMyData = (rowIndex, columnId, value) => {
        // We also turn on the flag to not reset the page
        setSkipPageReset(true)
        setData(old =>
            old.map((row, index) => {
            if (index === rowIndex) {
                return {
                ...old[rowIndex],
                [columnId]: value,
                }
            }
            return row
            })
        )
    }
      
    // Set our editable cell renderer as the default Cell renderer
    const defaultColumn = {
        Cell:  EditableCell
    }

    // After data chagnes, we turn the flag back off
    // so that if data actually changes when we're not
    // editing it, the page is reset
    useEffect(() => {
        setSkipPageReset(false)
    }, [data])

    // Let's add a data resetter/randomizer to help
    // illustrate that flow...
    const resetData = () => setData(originalData)

    const getRowId = React.useCallback(row => {
        return row.id
    }, [])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows,
        setGlobalFilter,
    } = useTable(
        {
        columns,
        data: data,
        defaultColumn,
        // use the skipPageReset option to disable page resetting temporarily
        autoResetPage: !skipPageReset,
        // updateMyData isn't part of the API, but
        // anything we put into these options will
        // automatically be available on the instance.
        // That way we can call this function from our
        // cell renderer!
        updateMyData,
        getRowId,
        globalFilter: ourGlobalFilterFunction,
        manualPagination: true,
        manualSortBy: true,
        initialState: { 
            searchInput: "",
            // pageIndex: 0,
            // pageSize: 10,
            sortBy: hasCustomSortBy ? customSortBy : [
                {
                    id: 'name',
                    desc: false
                }
            ],
            // hiddenColumns: customHiddenColumn || []
        },
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination,
    )

    // const moveRow = (dragIndex, hoverIndex) => {
    //     const dragRecord = records[dragIndex]
    //     const new_records = update(records, {
    //       $splice: [
    //           [dragIndex, 1],
    //           [hoverIndex, 0, dragRecord],
    //       ],
    //     })
    //     const new_order = new_records.map(row => {
    //         return row.id
    //     })
    //     handleReorder(new_order)
    //     setRecords(new_records)
    // }
    
    return (
        <>
            { searchOn ?
            // <SearchBar label={searchLabel} handleFilterInputChange={handleFilterInputChange} ourGlobalFilterFunction={ourGlobalFilterFunction} /> 
            <SearchBar label={searchLabel} handleFilterInputChange={handleFilterInputChange} />
            : "" }

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
                        <th {...column.getHeaderProps(column.getSortByToggleProps())} onClick={() => columnHeaderClick(column)}>
                        {// Render the header
                        column.render('Header')}
                        
                        {/* Column filter UI */}
                        {/* <div>{column.canFilter ? column.render('Filter') : null}</div> */}
                        
                        {/* Sorting UI */}
                        <span className="w-auto ms-2 me-0 float-right text-end">
                            {!column.disableSortBy ? (column.sortDirection === 'ASC' ?
                            <img src={SORT_ASC} className="img-icon"></img> :
                            column.sortDirection === 'DESC'
                                ? <img src={SORT_DESC} className="img-icon"></img>
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
                // showAll ? 
                // (dnd ? 
                // rows.map((row, i) => 
                //     // Prepare the row for display
                //     prepareRow(row) || (
                //         <Row
                //         index={i}
                //         row={row}
                //         moveRow={moveRow}
                //         navUrl={navUrl}
                //         {...row.getRowProps(rowProps(row))}
                //         />
                //     )
                // ) :
                rows.map((row, i) => {
                    // Prepare the row for display
                    prepareRow(row)
                    return (
                    <tr {...row.getRowProps(rowProps(row))}>
                        {row.cells.map(cell => {
                        return <td {...cell.getCellProps()}> {cell.render('Cell')}</td>
                        })}
                    </tr>
                    )
                })
                // )
                }
                </tbody>
            </table>
            </DndProvider>

            {
                showAll ? "" :
                <TablePagination
                    pageIndex={pageIndex}
                    // pageOptions={pageOptions}
                    // previousPage={previousPage}
                    canPreviousPage={canPreviousPage}
                    // nextPage={nextPage}
                    canNextPage={canNextPage}
                    updatePageCount={updatePageCount}
                    pageSize={pageSize}
                    totalPages={totalPages}
                    sortOptions={sortOptions}
                    searchValue={searchValue}
                    // page={page}
                />
            }
        </>
    )
}

// Create an editable cell renderer
const EditableCell = ({
    value: initialValue,
    row: { index },
    column: { id },
    updateMyData, // This is a custom function that we supplied to our table instance
}) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue)
  
    const onChange = e => {
      setValue(e.target.value)
    }
  
    // We'll only update the external data when the input is blurred
    const onBlur = () => {
      updateMyData(index, id, value)
    }
  
    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])
  
    return <input className="form-control pb-2 w-75" value={value} onChange={onChange} onBlur={onBlur} />
}

// const DND_ITEM_TYPE = 'row'

// const Row = ({ row, index, moveRow, navUrl }) => {
//   const dropRef = React.useRef(null)
//   const dragRef = React.useRef(null)
//   const navigate = useNavigate();

//   const [, drop] = useDrop({
//     accept: DND_ITEM_TYPE,
//     hover(item, monitor) {
//       if (!dropRef.current) {
//         return
//       }
//       const dragIndex = item.index
//       const hoverIndex = index
//       // Don't replace items with themselves
//       if (dragIndex === hoverIndex) {
//         return
//       }
//       // Determine rectangle on screen
//       const hoverBoundingRect = dropRef.current.getBoundingClientRect()
//       // Get vertical middle
//       const hoverMiddleY =
//         (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
//       // Determine mouse position
//       const clientOffset = monitor.getClientOffset()
//       // Get pixels to the top
//       const hoverClientY = clientOffset.y - hoverBoundingRect.top
//       // Only perform the move when the mouse has crossed half of the items height
//       // When dragging downwards, only move when the cursor is below 50%
//       // When dragging upwards, only move when the cursor is above 50%
//       // Dragging downwards
//       if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
//         return
//       }
//       // Dragging upwards
//       if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
//         return
//       }
//       // Time to actually perform the action
//       moveRow(dragIndex, hoverIndex)
//       // console.log(row)
//       // Note: we're mutating the monitor item here!
//       // Generally it's better to avoid mutations,
//       // but it's good here for the sake of performance
//       // to avoid expensive index searches.
//       item.index = hoverIndex
//     },
//   })

//   const [{ isDragging }, drag, preview] = useDrag({
//     type: DND_ITEM_TYPE,
//     item: { index },
//     collect: monitor => ({
//       isDragging: monitor.isDragging(),
//     }),
//   })

//   const opacity = isDragging ? 0 : 1

//   preview(drop(dropRef))
//   drag(dragRef)

//   return (
//     <tr ref={dropRef} style={{ opacity }} {...row.getRowProps()} onClick={navUrl ? () => navigate(navUrl + row.original.id) : () => void 0}>
//       <td ref={dragRef}><i className='bi bi-list'></i></td>
//       {row.cells.map(cell => {
//       return (<td {...cell.getCellProps()}>{cell.render('Cell')}</td>)}
//       )}
//     </tr>
//   )
// }