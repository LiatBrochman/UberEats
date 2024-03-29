import {DataStore} from "aws-amplify";
import {Dish, Restaurant} from "../models";
import React, {createContext, useContext, useEffect, useState} from "react";
import {useAuthContext} from "./AuthContext";
import {cacheImagesArray} from "../myExternalLibrary/CachedImage";


const RestaurantContext = createContext({})
const RestaurantContextProvider = ({children}) => {

    const {dbCustomer} = useAuthContext()

    const [restaurants, setRestaurants] = useState([])
    const [restaurant, setRestaurant] = useState(null)
    const [restaurantDishes, setRestaurantDishes] = useState([])

    function initRestaurantsImages() {
        cacheImagesArray(restaurants.map(r => r.image))
    }

    function initDishesImages() {
        DataStore.query(Dish, d => d.and(d => [d.isDeleted.eq(false), d.originalID.eq("null")]))
            .then(dishes => cacheImagesArray(dishes.map(d => d.image)))
    }

    function cacheImages() {
        initRestaurantsImages()
        initDishesImages()
    }

    useEffect(() => {
        if (!dbCustomer || subscription.hasOwnProperty("restaurants")) return;


        subscription.restaurants = DataStore.observeQuery(Restaurant, r => r.isDeleted.eq(false))
            .subscribe(({items, isSynced}) => {
                isSynced && setRestaurants(items)
            })
        // return subscription?.restaurants?.unsubscribe()

    }, [dbCustomer])

    useEffect(() => {
        // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ restaurant ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(restaurant,null,4))
        if (!restaurant) return;

        subscription.restaurantDishes = DataStore.observeQuery(Dish, dish => dish.and(
            dish =>
                [
                    dish.restaurantID.eq(restaurant.id),
                    dish.originalID.eq("null")
                ]
        )).subscribe(({items, isSynced}) => {
            // isSynced && setRestaurantDishes(items)
            setRestaurantDishes(items)
        })
        // return subscription?.restaurantDishes?.unsubscribe()

    }, [restaurant])

    useEffect(() => {
        restaurants.length && cacheImages()
    }, [restaurants])


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


