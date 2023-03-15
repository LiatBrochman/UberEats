import {useRestaurantContext} from "../contexts/RestaurantContext";
import AppRoutes from "./AppRoutes";
import NewRestaurant from "../screens/NewRestaurant";
import {Image} from "@aws-amplify/ui-react";
import {useAuthContext} from "../contexts/AuthContext";

const ProtectedRoutes = () => {

    const {dbOwner} = useAuthContext({dbOwner: null})
    const {finishedFetching, restaurant} = useRestaurantContext({finishedFetching: false, restaurant: null})
    const loadingScreen = <Image style={{display: "block", marginLeft: "auto", marginRight: "auto"}} src={"https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"}/>


    if (!dbOwner) return loadingScreen


    switch (finishedFetching) {

        case true://enter existing restaurant or create a new one
            return restaurant ? <AppRoutes/> : <NewRestaurant/>

        case false:
            return loadingScreen

    }


}
export default ProtectedRoutes
