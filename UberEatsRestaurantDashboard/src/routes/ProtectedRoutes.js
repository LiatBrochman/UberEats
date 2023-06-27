import {useRestaurantContext} from "../contexts/RestaurantContext";
import AppRoutes from "./AppRoutes";
import NewRestaurant from "../screens/NewRestaurant";
import {useAuthContext} from "../contexts/AuthContext";
import ReactLoading from "react-loading";
import "./index.css"


const ProtectedRoutes = ({hideMenu}) => {
    hideMenu.value = false
    const {dbOwner} = useAuthContext({dbOwner: null})
    const {finishedFetching, restaurant} = useRestaurantContext({finishedFetching: false, restaurant: null})
    const loadingScreen =
        <div className="loader-container">
            <ReactLoading
                type={"bars"}
                color={"#96CEB4"}
                height={100}
                width={150}
            />
        </div>

    if (!dbOwner) return loadingScreen

    switch (finishedFetching) {

        case true://enter existing restaurant or create a new one
            return restaurant ? <AppRoutes/> : <NewRestaurant/>

        case false:
            return loadingScreen
    }
}
export default ProtectedRoutes

