
import React from 'react';
import GenericDishEditor from "../GenericDishEditor";
import {useLocation} from 'react-router-dom'

function EditMenuItem() {
    const location = useLocation()
    const  dish  = location.state
    return <GenericDishEditor props={{type:"EDIT", dish}}/>
}

export default EditMenuItem;
