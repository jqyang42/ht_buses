import api from "./api"

export function makeSchoolsDropdown() {
    return getSchools().then(res => {            
        return res.data.schools.map(school => {
            return {
                value: school.id, 
                display: school.name
            }
        })
    })
}

function getSchools() {
    return api.get(`schools`)
}