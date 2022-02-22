import api from "../components/api";

export async function getPage({ pageIndex }) {
    const response = await api.get(`students?page=${pageIndex}`)
    console.log(response)
    return {
        data: response.data,
        pageIndex: response.data.page.current_page,
        canPreviousPage: response.data.page.can_prev_page,
        canNextPage: response.data.page.can_next_page,
        totalPages: response.data.page.total_pages
    }
}

async function showAll() {
    return await getPage({ pageIndex: 0 })
    // canPreviousPage and canNextPage should both be false
}

// async function nextPage