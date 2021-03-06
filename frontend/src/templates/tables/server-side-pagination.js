import api from "../components/api";

// additionalParams --> holds &id=x
export async function getPage({ url, pageIndex, sortOptions, searchValue, additionalParams, only_pagination }) {
    const has_sort = sortOptions === null ? false : sortOptions.sortDirection!== 'none' 
    
    let order_by = has_sort ? sortOptions.sortDirection.toLowerCase() : ''
    const sort_by = has_sort ? sortOptions.accessor : ''

    if ((sort_by === 'in_range' || sort_by === 'pickup')&& (order_by === 'asc' || order_by === 'desc')) {
        if (order_by === 'asc') {
            order_by = 'desc'
        } else {
            order_by = 'asc'
        }
    }
    const params = additionalParams ? additionalParams : ''

    // console.log(only_pagination)

    let response
    if (only_pagination) {
        response = await api.get(`${url}?page=${pageIndex}${params}`)
    } else {
        response = await api.get(`${url}?page=${pageIndex}&sort_by=${sort_by}&order_by=${order_by}&q=${searchValue}${params}`)
    }

    return {
        data: response.data,
        pageIndex: response.data.page.current_page,
        canPreviousPage: response.data.page.can_prev_page,
        canNextPage: response.data.page.can_next_page,
        totalPages: response.data.page.total_pages
    }
}