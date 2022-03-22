import React from "react";

// const TablePagination = (props) => {
export function TablePagination( {pageIndex, canPreviousPage, canNextPage, updatePageCount, pageSize, totalPages, sortOptions, searchValue} ) {
    // // console.log(props.pageOptions)
    const prevPage = parseInt(pageIndex) - 1
    const nextPage = parseInt(pageIndex) + 1

    return (
        <div className="row TablePagination align-middle align-items-center">
            
            <div className="col table-pagesIndexing">
                {
                    (totalPages === 0) ? (
                        <p>
                            {/* Showing {(props.pageIndex * props.pageSize)} to {((props.pageIndex) * props.pageSize) + props.page.length} out of {props.rows} entries  |   */}
                            Page 0 of 0
                        </p>
                    ) : (
                        <p>
                            {/* Showing {(props.pageIndex * props.pageSize) + 1} to {((props.pageIndex) * props.pageSize) + props.page.length} out of {props.rows} entries  |   */}
                            Page {pageIndex} of {totalPages}
                        </p>
                    )
                }

            </div>
            <div className="col">
                <nav className="row d-inline-flex float-end" aria-label="Students Pagination">
                    <ul className="pagination">
                    <li className="page-item">
                        <a className="page-link" onClick={canPreviousPage ? () => {updatePageCount(prevPage, sortOptions, searchValue)} : () => {}} disabled={!canPreviousPage}>
                            Previous
                        </a>
                    </li>
                    {/* <ul className="pagination d-flex"> */}
                        {/* {
                            props.pageOptions.map((index, page) => {
                                let totalPages = props.pageOptions.length;
                                if (page + 1 > 5 && page + 1 < 10 && totalPages >= 10) {
                                    return
                                }
                                if (page + 1 === 10) {
                                    return <li className="page-item" key={index}>....{10}</li>
                                }
                                if (page + 1 > 10 && totalPages > 10) {
                                    const numbersOFpagesAfter_Page_10 = props.pageOptions.slice(10);
                                    if (numbersOFpagesAfter_Page_10.length > 3 && page + 1 === totalPages) {
                                        return <li className="page-item" key={index}>....{totalPages}</li>
                                    }
                                    if (numbersOFpagesAfter_Page_10.length > 3 && page + 1 <= 12) {
                                        return <li className="page-item" key={index}><a className="page-link" onClick={props.page}>{page + 1}</a></li>
                                    }
                                    if (numbersOFpagesAfter_Page_10.length > 3) {
                                        return
                                    }
                                    return <li className="page-item" key={index}>{page + 1}</li>
                                }
                                return <li className="page-item" key={index}><a className="page-link" onClick={props.page}>{page + 1}</a></li>
                            })} */}
                    <li className="page-item">
                        <a className="page-link" disabled={!canNextPage} onClick={canNextPage ? () => {updatePageCount(nextPage, sortOptions, searchValue)} : () => {}} >
                            Next
                        </a>
                    </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default TablePagination;