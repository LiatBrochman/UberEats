import {useRestaurantContext} from "../contexts/RestaurantContext";
import {useEffect, useState} from "react";
import AppRoutes from "./AppRoutes";
import NewRestaurant from "../screens/NewRestaurant";

const ProtectedRoutes = () => {

    const {restaurant} = useRestaurantContext()
    const [restaurantIsEmpty, setRestaurantIsEmpty] = useState(true)



    useEffect(() => {
        restaurantIsEmpty && restaurant?.id && setRestaurantIsEmpty(false)
    }, [restaurant]);


    return restaurantIsEmpty ? (
        <NewRestaurant/>
    ) : (
        <AppRoutes/>

    )

}
export default ProtectedRoutes