import {DataStore} from "aws-amplify";
import {Dish, Restaurant} from "../models";
import {createContext, useContext, useEffect, useState} from "react";
import {useAuthContext} from "./AuthContext";


const RestaurantContext = createContext({})

const RestaurantContextProvider = ({children}) => {

    const {dbOwner} = useAuthContext()
    const [restaurantDishes, setRestaurantDishes] = useState([])
    const [restaurant, setRestaurant] = useState(null)


    useEffect(() => {
        if (dbOwner && !restaurant) {
            DataStore.observeQuery(Restaurant, r => r.ownerID.eq(dbOwner.id))
                .subscribe(({items, isSynced}) => {
                    if (isSynced) {
                        setRestaurant(items[0])
                        // console.log("subscribing to restaurant")
                        // console.table(items[0])
                    }
                })
        }
    }, [dbOwner])


    useEffect(() => {
        if (restaurant && restaurantDishes.length === 0)
            // subscription.restaurantDishes =
        {
            DataStore.observeQuery(Dish, dish => dish.and(
                dish =>
                    [
                        dish.restaurantID.eq(restaurant.id),
                        dish.originalID.eq("null"),
                        dish.isDeleted.eq(false)
                    ]
            )).subscribe(({items, isSynced}) => {
                if (isSynced) {
                    // console.log("subscribing to dishes of restaurant")
                    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ Restaurant Dishes: ~~~~~~~~~~~~~~~~~~~~~ ", JSON.stringify(items, null, 4))
                    setRestaurantDishes(items)

                }
            })
        }
    }, [restaurant])


    return (<RestaurantContext.Provider
            value={{
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


