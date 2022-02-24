import api from "../components/api";

export async function getPage({ url, pageIndex, sortOptions, searchValue, additionalParams }) {
    const order_by = sortOptions?.sortDirection
    const sort_by = sortOptions?.accessor
    // const search = searchValue !== '' ? searchValue : false
    const search = searchValue
    const params = additionalParams ? additionalParams : ''

    let response
    if (!order_by || order_by === 'none') {
        if (search === '') {
            response = await api.get(`${url}?page=${pageIndex}${params}`)
        } else {
            response = await api.get(`${url}/search?page=${pageIndex}&q=${search}`)
        }
    } else {
        if (url === 'routes') {
            response = await api.get(`${url}/sort?page=${pageIndex}&search=${searchValue !== ''}&q=${searchValue}&order_by=${order_by.toLowerCase()}&sort_by=${sort_by}`)
        } else {
            response = await api.get(`${url}/sort?page=${pageIndex}&order_by=${order_by.toLowerCase()}&sort_by=${sort_by}&q=${search}`)
        }
    }

    http://localhost:8000/api/routes/sort?order_by=asc&sort_by=name&page=1&search=false&q=

    console.log(response)
    return {
        data: response.data,
        pageIndex: response.data.page.current_page,
        canPreviousPage: response.data.page.can_prev_page,
        canNextPage: response.data.page.can_next_page,
        totalPages: response.data.page.total_pages
    }
}