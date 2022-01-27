import React from "react";

const TablePagination = (props) => {
    console.log(props.page);
    return (
        <div className="row TablePagination">
            
            <div className="col table-pagesIndexing">Showing {(props.pageIndex * props.pageSize) + 1} to {((props.pageIndex) * props.pageSize) + props.page.length} out of {props.page.length} entries</div>
            <div className="col">
                <nav className="row d-inline-flex float-end" aria-label="Students Pagination">
                    <ul class="pagination">
                    <li class="page-item">
                        <a class="page-link" onClick={props.previousPage} disabled={!props.canPreviousPage}>
                            Previous
                        </a>
                    </li>
                    {/* <ul className="pagination d-flex"> */}
                        {
                            props.pageOptions.map((index, page) => {
                                let totalPages = props.pageOptions.length;
                                if (page + 1 > 5 && page + 1 < 10 && totalPages >= 10) {
                                    return
                                }
                                if (page + 1 === 10) {
                                    return <li class="page-item" key={index}>....{10}</li>
                                }
                                if (page + 1 > 10 && totalPages > 10) {
                                    const numbersOFpagesAfter_Page_10 = props.pageOptions.slice(10);
                                    if (numbersOFpagesAfter_Page_10.length > 3 && page + 1 === totalPages) {
                                        return <li class="page-item" key={index}>....{totalPages}</li>
                                    }
                                    if (numbersOFpagesAfter_Page_10.length > 3 && page + 1 <= 12) {
                                        return <li class="page-item" key={index}>{page + 1}</li>
                                    }
                                    if (numbersOFpagesAfter_Page_10.length > 3) {
                                        return
                                    }
                                    return <li class="page-item" key={index}>{page + 1}</li>
                                }
                                return <li class="page-item" key={index}><a class="page-link" onClick={props.page}>{page + 1}</a></li>
                            })}
                    <li class="page-item">
                        <a class="page-link" onClick={props.nextPage} disabled={!props.canNextPage}>
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