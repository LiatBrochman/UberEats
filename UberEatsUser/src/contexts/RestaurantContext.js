import {Amplify, DataStore} from "aws-amplify";
import {Dish, Restaurant} from "../models";
import {createContext, useState, useEffect, useContext} from "react";
import {useAuthContext} from "./AuthContext";
import {subscription} from "../screens/HomeScreen";

const getDishes_ByRestaurant = async ({restaurant}) => {
    const restaurantDishes = await DataStore.query(Dish, dish => dish.and(
        dish =>
            [
                dish.restaurantID.eq(restaurant.id),
                dish.originalID.eq("null")
            ]
    ))
        .then(result => {
            if (!result) return null
            if (result instanceof Array) {
                return result.filter(entity => entity.isDeleted === false)
            } else {
                return result
            }
        })

    //console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ restaurantDishes ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(restaurantDishes, null, 4))

    return restaurantDishes
}


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
    const {dbCustomer} = useAuthContext()
    const [restaurants, setRestaurants] = useState([]);
    const [restaurant, setRestaurant] = useState()
    const [restaurantDishes, setRestaurantDishes] = useState()

    useEffect(() => {
        subscription.restaurants = DataStore.observeQuery(Restaurant, r => r.isDeleted.eq(false)).subscribe(({items}) => {
            if (items?.length) {
                setRestaurants(items)
            }
        })

    }, [dbCustomer])


    useEffect(() => {
        //todo -- dont delete
        // restaurant && !dishes && getDishes_ByRestaurant({restaurant}).then(setDishes)

        if (restaurant?.id)
            subscription.restaurantDishes = DataStore.observeQuery(Dish, dish => dish.and(
                dish =>
                    [
                        dish.restaurantID.eq(restaurant.id),
                        dish.originalID.eq("null")
                    ]
            )).subscribe(dishes => {
                dishes?.items?.length && setRestaurantDishes(dishes.items)
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


