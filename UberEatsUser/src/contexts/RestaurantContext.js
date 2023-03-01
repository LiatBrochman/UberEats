import {DataStore} from "aws-amplify";
import {Dish, Restaurant} from "../models";
import {createContext, useContext, useEffect, useState} from "react";
import {useAuthContext} from "./AuthContext";


const RestaurantContext = createContext({})
const RestaurantContextProvider = ({children}) => {

    const {dbCustomer} = useAuthContext()

    const [restaurants, setRestaurants] = useState([])
    const [restaurant, setRestaurant] = useState(null)
    const [restaurantDishes, setRestaurantDishes] = useState([])

    useEffect(() => {
        if (!dbCustomer || subscription.hasOwnProperty("restaurants")) return;


        subscription.restaurants = DataStore.observeQuery(Restaurant, r => r.isDeleted.eq(false))
            .subscribe(({items, isSynced}) => {
                isSynced && setRestaurants(items)
            })
        // return subscription?.restaurants?.unsubscribe()

    }, [dbCustomer])


    useEffect(() => {
        if (!restaurant || subscription.hasOwnProperty("restaurantDishes")) return;


        subscription.restaurantDishes = DataStore.observeQuery(Dish, dish => dish.and(
            dish =>
                [
                    dish.restaurantID.eq(restaurant.id),
                    dish.originalID.eq("null")
                ]
        )).subscribe(({items, isSynced}) => {
            isSynced && setRestaurantDishes(items)
        })
        // return subscription?.restaurantDishes?.unsubscribe()

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


