import {useRestaurantContext} from "../contexts/RestaurantContext";
import {useEffect, useState} from "react";
import AppRoutes from "./AppRoutes";
import NewRestaurant from "../screens/NewRestaurant";
import {Text} from "@aws-amplify/ui-react";

const ProtectedRoutes = () => {

    const {loading,restaurant} = useRestaurantContext()
    const [restaurantIsEmpty, setRestaurantIsEmpty] = useState(true)


    useEffect(() => {
        restaurantIsEmpty && restaurant?.id && setRestaurantIsEmpty(false)
    }, [restaurant]);


    return restaurantIsEmpty ? (
        loading
            ? <Text style={{fontSize:100}}>...Loading...</Text>
            : <NewRestaurant/>
    ) : (
        <AppRoutes/>

    )

}
export default ProtectedRoutes