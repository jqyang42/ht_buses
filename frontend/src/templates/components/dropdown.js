import api from "./api"

export async function makeParentsDropdown() {
    const res = await api.get(`users?page=0`)
    const dropdown = res.data.users.filter(user => {
        return user.is_parent === true
    }).sort((a, b) => { return ('' + a.last_name).localeCompare(b.last_name) }).map(parent => {
        return { 
            user_id: parent.id, 
            name: `${parent.first_name} ${parent.last_name}` 
        }
    })
    
    return dropdown
}

export async function makeSchoolsDropdown() {
    const res = await api.get(`schools?page=0`)
    console.log(res.data.schools)
    const dropdown = res.data.schools.map(school => {
        return {
            value: school.id,
            display: school.name
        }
    })

    dropdown.sort((a, b) => { return ('' + a.display).localeCompare(b.display) })
    return dropdown
}

export async function makeRoutesDropdown({ school_id }) {
    const res = await api.get(`schools/detail?id=${school_id}`)
    const routes_data = res.data?.routes || []
    const dropdown = routes_data.map(route => {
        return {
            value: route.id,
            display: route.name
        }
    })

    dropdown.sort((a, b) => { return ('' + a.display).localeCompare(b.display) })
    return dropdown
}