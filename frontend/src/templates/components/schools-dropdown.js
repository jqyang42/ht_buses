import api from "./api"

export function makeSchoolsDropdown() {
    return getSchools().resolve(then(res => {            
        const schools_dropdown = res.data.schools.map(school => {
            return {
                value: school.id, 
                display: school.name
            }
        })
        return schools_dropdown
    }))
}

function getSchools() {
    return api.get(`schools`)
}