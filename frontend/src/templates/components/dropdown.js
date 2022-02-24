import api from "./api"

export async function makeParentsDropdown() {
    const res = await api.get(`users?page=0`)
    return res.data.users.filter(user => {
        return user.is_parent === true
    }).map(parent => {
        return { 
            user_id: parent.id, 
            name: `${parent.first_name} ${parent.last_name}` 
        }
    })
}

export async function makeSchoolsDropdown() {
    const res = await api.get(`schools?page=0`)
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