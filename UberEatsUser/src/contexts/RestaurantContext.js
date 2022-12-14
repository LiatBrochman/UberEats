import {DataStore} from "aws-amplify";
import {Dish, Restaurant} from "../models";
import {createContext, useState, useEffect, useContext} from "react";
import {useAuthContext} from "./AuthContext";
import {subscription} from "../screens/HomeScreen";

const RestaurantContext = createContext({})
const RestaurantContextProvider = ({children}) => {

    const getRestaurant_ByID = async id => {
        // const res =
        return await DataStore.query(Restaurant, id)
            .then(result => {
                if (!result) return null
                if (result instanceof Array) {
                    return result.filter(entity => entity.isDeleted === false)
                } else {
                    return result
                }
            })

        // return (res instanceof Array ? [res] : res)
    }
    const {dbCustomer} = useAuthContext({})
    const [restaurants, setRestaurants] = useState([]);
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
                getRestaurant_ByID,
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
export const useRestaurantContext = () => useContext(RestaurantContext);


