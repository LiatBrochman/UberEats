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
                if (isSynced) {
                    items.length && setRestaurant(items[0])
                    setFinishedFetching(true)
                }
            })

    }, [dbOwner])


    useEffect(() => {
        if (restaurantDishes.length > 0) return;

        window.subscription.orderDishes= DataStore.observeQuery(Dish, d => d.and(d =>
            [
                d.restaurantID.eq(restaurant?.id),
                d.originalID.eq("null"),
                d.isDeleted.eq(false)
            ]
        )).subscribe(({items, isSynced}) => {
            if (isSynced) {
                setRestaurantDishes(items)
            }
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


