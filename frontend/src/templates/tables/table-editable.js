import React, { useEffect, useState } from 'react';
import { useTable, useSortBy, usePagination, useFilters, useGlobalFilter } from 'react-table';
import { SORT, SORT_ASC, SORT_DESC } from "../../constants";
import { useNavigate } from "react-router-dom";
import SearchBar from './search-bar';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TablePagination from "./pagination";
import update from 'immutability-helper';
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Autocomplete from "react-google-autocomplete";
import { GOOGLE_API_KEY } from "../../constants";

export function TableEditable({ columns, origData, searchOn, searchLabel, ourGlobalFilterFunction, showAll, navUrl, dnd, handleReorder, hasCustomSortBy, customSortBy, 
    rowProps = () => ({}), pageIndex, canPreviousPage, canNextPage, updatePageCount, pageSize, totalPages, columnHeaderClick, sortOptions, searchValue, editable, updateData, fullWidth }) {

    const navigate = useNavigate();

    const handleFilterInputChange = (e) => {
        // console.log(e.currentTarget.value);
        searchValue = e.currentTarget.value;
        updatePageCount(pageIndex, sortOptions, searchValue)
    };

    const [data, setData] = useState(origData)
    const [skipPageReset, setSkipPageReset] = React.useState(false)
    // console.log(origData)
    // console.log(data)

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

    // After data chagnes, we turn the flag back off so that if data actually changes 
    // when we're not editing it, the page is reset
    useEffect(() => {
        setSkipPageReset(false)
        updateData(data)
        // console.log(data)
    }, [data])

    // updates data if origdata changes
    useEffect(() => {
        setData(origData)
    }, [origData])

    const getRowId = React.useCallback(row => {
        return row.row_num
    }, [])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows,
    } = useTable(
        {
        columns,
        data,
        defaultColumn,
        // use the skipPageReset option to disable page resetting temporarily
        autoResetPage: !skipPageReset,
        updateMyData,
        getRowId,
        },
    )
    
    return (
        <>
            <DndProvider backend={HTML5Backend}>
            {/* // apply the table props */}
            <div className='table-responsive mb-4 w-100'>
            <table {...getTableProps()} className={fullWidth ? "table table-striped table-hover full-width" : "table table-striped table-hover med-width"}>
                <thead>
                {// Loop over the header rows
                headerGroups.map(headerGroup => (
                    // Apply the header row props
                    <tr {...headerGroup.getHeaderGroupProps()}>
                    {dnd ? <th></th> : ""}
                    {// Loop over the headers in each row
                    headerGroup.headers.map(column => (
                        // Apply the header cell props
                        <th {...column.getHeaderProps()} onClick={() => columnHeaderClick(column)}>
                        {// Render the header
                        column.render('Header')}
                        </th>
                    ))}
                    </tr>
                ))}
                </thead>
                {/* Apply the table body props */}
                <tbody {...getTableBodyProps()}>
                {// Loop over the table rows
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
                }
                </tbody>
            </table>
            </div>
            </DndProvider>
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
    const [value, setValue] = React.useState(initialValue[0])
    const [selectValue, setSelectValue] = React.useState(initialValue[0])
    const [completeValue, setComplete] = React.useState(initialValue)
    
    const onChange = e => {
        const val = e.target.value
        setValue(val)

        const updated_complete = completeValue
        updated_complete[0] = val
        setComplete(updated_complete)
    }

    // // for autocomplete selection
    // const onSelectAutocompleteChange = e => {
    //     setSelectValue(e.formatted_address)
    // }

    // const onCheckboxChange = e => {
    //     console.log(e.target.checked)
    //     setSelectValue(e.target.checked)
    // }

    useEffect(() => {
        setValue(selectValue)
        updateMyData(index, id, selectValue)
    }, [selectValue])
  
    // We'll only update the external data when the input is blurre
    const onBlur = () => {
      updateMyData(index, id, value)
      // console.log(index, id, value)
    }
  
    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
        setValue(initialValue[0])
        setSelectValue(initialValue[0])
        setComplete(initialValue)
    }, [initialValue])

    const renderTooltip = error => (
        <Tooltip className="text-center">{error}</Tooltip>
    );
  
    return <div>
                {Array.isArray(completeValue) && (completeValue[1] || completeValue[3]) ? 
                    <OverlayTrigger placement="top" overlay={
                        renderTooltip(
                            completeValue[1] ? completeValue[2] + (completeValue[3] ? " and " + completeValue[4].toLowerCase() : "") : completeValue[4]
                        )}>
                        <i className="input-icon bi bi-exclamation-circle mt-2 me-6 float-end"></i>
                    </OverlayTrigger> : ""
                }
                {id === 'address' ?  
                    <div>
                        <Autocomplete
                        apiKey={GOOGLE_API_KEY}
                        options={{
                            types: ['address']
                        }}
                        placeholder="Enter home address" className={Array.isArray(completeValue) && (completeValue[1] || completeValue[3]) ? "form-control pb-2 w-90 error" : "form-control pb-2 w-90"} id="exampleInputAddress1"
                        onChange={onChange}
                        defaultValue={value}
                        onPlaceSelected={(event) => {setSelectValue(event.formatted_address)}}
                        onBlur={onBlur} />
                    </div>
                : ( id === 'exclude' ?
                    <div>
                        <div className="mt-2 d-flex align-items-center justify-content-center">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" checked={value} onChange={event => {setSelectValue(event.target.checked)}} onBlur={onBlur}/>
                            </div>
                        </div>
                    </div>
                 :
                    <input className={Array.isArray(completeValue) && (completeValue[1] || completeValue[3]) ? "form-control pb-2 w-90 error" : "form-control pb-2 w-90"} value={value} onChange={onChange} onBlur={onBlur}></input>
                )}
            </div>
}