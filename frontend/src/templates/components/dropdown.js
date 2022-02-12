import api from "./api"

export async function makeSchoolsDropdown() {
    const res = await api.get(`schools`)
    return res.data.schools.map(school => {
        return {
            value: school.id,
            display: school.name
        }
    })
}

export async function makeRoutesDropdown({ school_id }) {
    const res = await api.get(`schools/detail?id=${school_id}`)
    const routes_data = res.data?.routes || []
    return routes_data.map(route => {
        return {
            value: route.id,
            display: route.name
        }
    })
}