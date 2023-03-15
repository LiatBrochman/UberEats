import React from "react";
import GenericRestaurantEditor from "../../components/GenericRestaurantEditor";


const NewRestaurant = () => {
console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ on create new restaurant page ~~~~~~~~~~~~~~~~~~~~~ ")

    return <GenericRestaurantEditor props={{type:"NEW"}}/>

}

export default NewRestaurant;
