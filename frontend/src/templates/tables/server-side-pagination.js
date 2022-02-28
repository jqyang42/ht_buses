import api from "../components/api";

// additionalParams --> holds ?id=x
export async function getPage({ url, pageIndex, sortOptions, searchValue, additionalParams }) {
    const show_all = pageIndex === 0
    const has_sort = sortOptions.sortDirection !== 'none'
    const has_search = searchValue !== ''
    
    const order_by = has_sort ? sortOptions.sortDirection.toLowerCase() : ''
    const sort_by = has_sort ? sortOptions.accessor : ''

    const response = await api.get(`${url}?page=${pageIndex}&sort_by=${sort_by}&order_by=${order_by}&q=${searchValue}`)
    
    console.log(response)
    return {
        data: response.data,
        pageIndex: response.data.page.current_page,
        canPreviousPage: response.data.page.can_prev_page,
        canNextPage: response.data.page.can_next_page,
        totalPages: response.data.page.total_pages
    }
}