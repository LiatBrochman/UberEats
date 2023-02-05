import {useRestaurantContext} from "../contexts/RestaurantContext";
import {useEffect, useState} from "react";
import AppRoutes from "./AppRoutes";
import NewRestaurant from "../screens/NewRestaurant";
import {Image, Text} from "@aws-amplify/ui-react";

const ProtectedRoutes = () => {

    const {loading,restaurant} = useRestaurantContext()
    const [restaurantIsEmpty, setRestaurantIsEmpty] = useState(true)


    useEffect(() => {
        restaurantIsEmpty && restaurant?.id && setRestaurantIsEmpty(false)
    }, [restaurant]);


    return restaurantIsEmpty ? (
        loading
            ? <Image style={{  display: "block", marginLeft: "auto", marginRight: "auto"}} src={"https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"}/>
            : <NewRestaurant/>
    ) : (
        <AppRoutes/>

    )


}
export default ProtectedRoutes
