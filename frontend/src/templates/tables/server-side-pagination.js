import api from "../components/api";

export async function getPage({ pageIndex }) {
    const response = await api.get(`students?page=${pageIndex}`)
    return {
        data: response.data,
        pageIndex: response.data.pageIndex,
        canPreviousPage: response.data.canPreviousPage,
        canNextPage: response.data.canNextPage
    }
}

async function showAll() {
    return await getPage({ pageIndex: 0 })
    // canPreviousPage and canNextPage should both be false
}

async function nextPage