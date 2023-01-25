// import React from 'react';
// import GenericDishEditor from "../GenericDishEditor";
// import {useParams} from "react-router-dom";
// import {useRestaurantContext} from "../../contexts/RestaurantContext";
//
// function EditMenuItem() {
//     const { id } = useParams()
//     const {restaurant, restaurantDishes} = useRestaurantContext()
//     const dish = restaurantDishes?.length>0 && restaurantDishes.find(d => d.id === props.dishID)
//     return(<GenericDishEditor props={{type:"EDIT",dishID:id}}/>)
// }
//
// export default EditMenuItem;


import React from 'react';
import GenericDishEditor from "../GenericDishEditor";
import {useLocation} from 'react-router-dom'

function EditMenuItem() {
    const location = useLocation()
    const  dish  = location.state
    return <GenericDishEditor props={{type:"EDIT", dish}}/>
}

export default EditMenuItem;