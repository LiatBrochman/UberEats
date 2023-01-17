import {DataStore} from "aws-amplify";
import {Dish, Restaurant} from "../models";
import {createContext, useState, useEffect, useContext} from "react";
import {useAuthContext} from "./AuthContext";
import {subscription} from "../screens/HomeScreen";

const RestaurantContext = createContext({})
const RestaurantContextProvider = ({children}) => {

    const {dbCustomer} = useAuthContext({})
    const [restaurants, setRestaurants] = useState([])
    const [restaurant, setRestaurant] = useState({})
    const [restaurantDishes, setRestaurantDishes] = useState([])

    useEffect(() => {
        if(dbCustomer?.id)
        subscription.restaurants = DataStore.observeQuery(Restaurant, r => r.isDeleted.eq(false)).subscribe(({items}) => {
                setRestaurants(items)
        })
    }, [dbCustomer])


    useEffect(() => {
        if (restaurant?.id)
            subscription.restaurantDishes = DataStore.observeQuery(Dish, dish => dish.and(
                dish =>
                    [
                        dish.restaurantID.eq(restaurant.id),
                        dish.originalID.eq("null")
                    ]
            )).subscribe(({items}) => {
               setRestaurantDishes(items)
            })

    }, [restaurant])


    return (<RestaurantContext.Provider
            value={{
                restaurant,
                restaurants,
                setRestaurant,
                restaurantDishes,

            }}
        >
            {children}
        </RestaurantContext.Provider>
    )
}


export default RestaurantContextProvider;
export const useRestaurantContext = () => useContext(RestaurantContext)


