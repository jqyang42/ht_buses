import api from "../components/api";

export async function getPage({ url, pageIndex, sortOptions, searchValue }) {
    const order_by = sortOptions?.sortDirection
    const sort_by = sortOptions?.accessor
    // const search = searchValue !== '' ? searchValue : false
    const search = searchValue

    let response
    if (!order_by || order_by === 'none') {
        // if (!search) {
        //     response = await api.get(`${url}?page=${pageIndex}`)
        // } else {
            response = await api.get(`${url}?page=${pageIndex}&q=${search}`)
        // }
    } else {
        // if (!search) {
        //     response = await api.get(`${url}/sort?page=${pageIndex}&order_by=${order_by.toLowerCase()}&sort_by=${sort_by}`)
        // } else {
            response = await api.get(`${url}/sort?page=${pageIndex}&order_by=${order_by.toLowerCase()}&sort_by=${sort_by}&q=${search}`)
        // }
    }

    console.log(response)
    return {
        data: response.data,
        pageIndex: response.data.page.current_page,
        canPreviousPage: response.data.page.can_prev_page,
        canNextPage: response.data.page.can_next_page,
        totalPages: response.data.page.total_pages
    }
}