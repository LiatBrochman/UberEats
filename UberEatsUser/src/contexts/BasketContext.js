import {createContext, useContext, useEffect, useState} from "react";
import {useAuthContext} from "./AuthContext";
import {useRestaurantContext} from "./RestaurantContext";
import {createNewBasket_DB, getBasket_DB, getTotalPrice} from "./Queries";
import {Basket, Dish} from "../models";
import {useDishContext} from "./DishContext";

const BasketContext = createContext({})


const BasketContextProvider = ({children}) => {
    const {dbCustomer} = useAuthContext()
    const {restaurant} = useRestaurantContext()
    // const {basketDishes} = require("./DishContext").useDishContext()
    // const {basketDishes} = useDishContext()
    const [basket, setBasket] = useState()
    // const initial = {
    //     totalPrice: (async () => {
    //         return basket ? await getTotalPrice({basket}) : restaurant?.deliveryFee
    //     })()
    // }
    // const [totalPrice, setTotalPrice] = useState(initial?.totalPrice || 0)
    // const [basketSize, setBasketSize] = useState()

    useEffect(() => {
        dbCustomer && restaurant &&
        // dbCustomer instanceof Customer &&
        // restaurant instanceof Restaurant &&
        // basket?.length === 0 &&
        getBasket_DB({dbCustomer, restaurant}).then(setBasket)
    }, [restaurant])

    // useEffect(() => {
    //     basket instanceof Basket &&
    //     getTotalPrice({basket}).then(setTotalPrice)
    // }, [basket])

    // useEffect(() => {
    //
    //     console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~BasketContextProvider: basketDishes ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(basketDishes,null,4))
    //
    //
    //     if (basketDishes?.[0] instanceof Dish) {
    //         console.log("\n\n ~~~~~~~~(basket context)~~~~~~~~~~~~~ basketDishes have been updated!!! ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(basketDishes, null, 4))
    //
    //         getTotalPrice({basket}).then(setTotalPrice)
    //         setBasketSize(basketDishes.length)
    //     }
    // }, [basketDishes])

    // const getTotalPrice= async()=> await getTotalPrice({basket,restaurant})

    const createNewBasket = async () => {
        let theBasket = getBasket_DB({dbCustomer, restaurant})
        if (!(theBasket instanceof Basket)) {
            theBasket = await createNewBasket_DB({dbCustomer, restaurant})
        }
        setBasket(theBasket)
        return theBasket
    }

    return (<BasketContext.Provider
            value={{
                createNewBasket,
                basket,
            }}
        >
            {children}
        </BasketContext.Provider>
    )
}

export default BasketContextProvider
export const useBasketContext = () => useContext(BasketContext)