import api from "../components/api";

export async function getPage({ url, pageIndex, order_by, sort_by }) {
    const response = await api.get(`${url}/sort?page=${pageIndex}&order_by=${order_by.toLowerCase()}&sort_by=${sort_by}`)
    console.log(response)
    return {
        data: response.data,
        pageIndex: response.data.page.current_page,
        canPreviousPage: response.data.page.can_prev_page,
        canNextPage: response.data.page.can_next_page,
        totalPages: response.data.page.total_pages
    }
}