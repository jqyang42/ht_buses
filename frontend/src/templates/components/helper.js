export function studentIDValidation( {student_id} ) {
    const isNumber = !isNaN(student_id)
    if (!isNumber ) {
        return false
    }
    else if(isNumber && Math.sign(student_id) === -1)   {
        return false
    }
    return true 
}