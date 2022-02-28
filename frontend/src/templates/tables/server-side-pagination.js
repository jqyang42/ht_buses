import api from "../components/api";

// additionalParams --> holds ?id=x
export async function getPage({ url, pageIndex, sortOptions, searchValue, additionalParams }) {
    const show_all = pageIndex === 0
    const has_sort = sortOptions.sortDirection !== 'none'
    const has_search = searchValue !== ''
    
    const order_by = has_sort ? sortOptions.sortDirection.toLowerCase() : ''
    const sort_by = has_sort ? sortOptions.accessor : ''

    const response = await api.get(`${url}?page=${pageIndex}&sort_by=${sort_by}&order_by=${order_by}&q=${searchValue}`)
    // let response
    // if (has_sort && has_search) {
    //     response = await api.get(`${url}?page=${pageIndex}&sort_by=${sort_by}&order_by=${order_by}&q=${searchValue}`)
    // } else if ()

    // Only sorting
    // url/api/users?page=1&sort_by=name&order_by=desc&q=
    // No sorting or search
    // url/api/users?page=1&sort_by=&order_by=&q=
    // Sorting and search
    // url/api/users?page=1&sort_by=name&order_by=asc&q=evelyn
    // Only search
    // url/api/users?page=1&sort_by=&order_by=&q=evelyn

    // const order_by = sortOptions?.sortDirection
    // const sort_by = sortOptions?.accessor
    // // const search = searchValue !== '' ? searchValue : false
    // const search = searchValue || ''
    // const params = additionalParams ? additionalParams : ''

    // let response
    // if (!order_by || order_by === 'none') {
    //     if (search === '') {
    //         response = await api.get(`${url}?page=${pageIndex}${params}`)
    //     } else {
    //         response = await api.get(`${url}/search?page=${pageIndex}&q=${search}`)
    //     }
    // } else {
    //     if (url === 'routes') {
    //         response = await api.get(`${url}/sort?page=${pageIndex}&search=${searchValue !== ''}&q=${searchValue}&order_by=${order_by.toLowerCase()}&sort_by=${sort_by}`)
    //     } else {
    //         response = await api.get(`${url}/sort?page=${pageIndex}&order_by=${order_by.toLowerCase()}&sort_by=${sort_by}&q=${search}`)
    //     }
    // }

    console.log(response)
    return {
        data: response.data,
        pageIndex: response.data.page.current_page,
        canPreviousPage: response.data.page.can_prev_page,
        canNextPage: response.data.page.can_next_page,
        totalPages: response.data.page.total_pages
    }
}