import {DataStore} from "aws-amplify";
import {Dish, Restaurant} from "../models";
import {createContext, useContext, useEffect, useState} from "react";
import {useAuthContext} from "./AuthContext";


const RestaurantContext = createContext({})

const RestaurantContextProvider = ({children}) => {

    const {dbOwner} = useAuthContext({dbOwner: null})
    const [restaurantDishes, setRestaurantDishes] = useState([])
    const [restaurant, setRestaurant] = useState(null)
    const [finishedFetching, setFinishedFetching] = useState(false)


    useEffect(() => {
        if (!dbOwner) return;

        window.subscription.restaurant = DataStore.observeQuery(Restaurant, r => r.ownerID.eq(dbOwner.id))
            .subscribe(({items, isSynced}) => {

                if (items.length) {
                    setRestaurant(items[0])
                    new Image().src = items[0].image
                }
                if (isSynced) {
                    setFinishedFetching(true)
                }
            })

    }, [dbOwner])


    useEffect(() => {
        if (restaurantDishes.length > 0) return;

        window.subscription.orderDishes = DataStore.observeQuery(Dish, d => d.and(d =>
            [
                d.restaurantID.eq(restaurant?.id),
                d.originalID.eq("null"),
                d.isDeleted.eq(false)
            ]
        )).subscribe(({items, isSynced}) => {
            // if (isSynced) {
            if (items.length) {
                setRestaurantDishes(items)
                items.forEach(({image})=> new Image().src = image)
            }
            // }
        })

    }, [restaurant])


    return (<RestaurantContext.Provider
            value={{
                finishedFetching,
                restaurant,
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


