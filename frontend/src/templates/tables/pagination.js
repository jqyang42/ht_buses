import React from "react";

export function TablePagination( {pageIndex, canPreviousPage, canNextPage, updatePageCount, pageSize, totalPages, sortOptions, searchValue} ) {
    const prevPage = parseInt(pageIndex) - 1
    const nextPage = parseInt(pageIndex) + 1

    return (
        <div className="row TablePagination align-middle align-items-center">
            
            <div className="col table-pagesIndexing">
                {
                    (totalPages === 0) ? (
                        <p>
                            Page 0 of 0
                        </p>
                    ) : (
                        <p>
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