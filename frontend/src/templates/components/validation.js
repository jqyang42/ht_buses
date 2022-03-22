import { emailRegex, passwordRegex, phoneRegex } from "../regex/input-validation"

export function emailValidation({ email }) {
    return emailRegex.test(email)
}

export function passwordValidation({ password }) {
    return passwordRegex.test(password)
}

export function validNumber({ value_to_check }) {
    const isNumber = !isNaN(value_to_check)
    if (!isNumber ) {
        return false
    }
    else if(isNumber && (Math.sign(value_to_check) === -1 || Math.sign(value_to_check) === 0))   {
        return false
    }
    return true 
}

export function phoneValidation({ phone_number }) {
    if(phone_number !== undefined && phone_number !== "") {
        const valid_phone_fromat =  phoneRegex.test(phone_number)
        if(!valid_phone_fromat) {
           return false 
            
        } 
        const stripped_phone = phone_number.replace(/\D/g, '');
        if (!isNaN(stripped_phone) && stripped_phone.length === 10) {
            return true  
        }
    }
    return false 
}
