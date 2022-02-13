export function studentsFromUsers({ users_data }) {
    let students = []
    if (users_data !== null) {
        students = users_data?.map(user => {
            return user.students
        })
        students = [].concat.apply([], students)
    }

    return students
}