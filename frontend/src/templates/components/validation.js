import { emailRegex, passwordRegex } from "../regex/input-validation"

export function emailValidation({ email }) {
    return emailRegex.test(email)
}

export function passwordValidation({ password }) {
    return passwordRegex.test(password)
}

export function studentIDValidation({ student_id }) {
    const isNumber = !isNaN(student_id)
    if (!isNumber ) {
        return false
    }
    else if(isNumber && (Math.sign(student_id) === -1 || Math.sign(student_id) === 0))   {
        return false
    }
    return true 
}
