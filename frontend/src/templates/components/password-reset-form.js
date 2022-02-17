import React, { Component } from 'react'
import { passwordRegex } from "../regex/input-validation";
import api from './api';
import { Link } from 'react-router-dom';
import PasswordForm from "../components/password-form";
/*
class PasswordResetForm extends PasswordForm {

    change_password = async () => { 
        const data = {
            password: this.state.password
        }
        const res = await api.post(`reset-password?uuid=${this.props.params.uuid}&token=${this.props.params.token}`, data)
        const password_changed = res.data.success 
        this.setState({ edit_success: password_changed ? 1 : -1 })
        return password_changed
    }
   
    handleSubmit = event => {
        
        event.preventDefault();

        if (!this.validPassword || (this.state.password !== this.state.confirm_password)) {
            this.setState({ edit_success: -1 })
            return 
        }

        this.change_password().then(password_changed => {
           
        })
        
       
    }

}

export default React.memo(PasswordResetForm)
*/