import { emailRegex } from "../regex/input-validation"

export function studentIDValidation({ student_id }) {
    const isNumber = !isNaN(student_id)
    if (!isNumber ) {
        return false
    }
    else if(isNumber && Math.sign(student_id) === -1)   {
        return false
    }
    return true 
}

export function emailValidation({ email }) {
    return emailRegex.test(email)
}