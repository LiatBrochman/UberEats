import {createContext, useContext, useEffect, useState} from "react";
import {useAuthContext} from "./AuthContext";
import {useRestaurantContext} from "./RestaurantContext";
import {useBasketContext} from "./BasketContext";
import {createNewOrder_DB, getOrders_DB, updateDishesAfterNewOrder_DB} from "./Queries";
import {useDishContext} from "./DishContext";

const OrderContext = createContext({})


const OrderContextProvider = ({children}) => {
    const {dbCustomer} = useAuthContext()
    const {restaurant} = useRestaurantContext()
    const {totalPrice} = useBasketContext()
    const {orderDishes} = useDishContext()


    const [customerOrders, setCustomerOrders] = useState()
    const [order, setOrder] = useState()

    useEffect(() => {
        customerOrders?.length === 0 &&
        getOrders_DB({dbCustomer}).then(setCustomerOrders)
    }, [dbCustomer])

    const orderValidation = () => {
        if (totalPrice && totalPrice > restaurant?.deliveryFee) {
            console.log("price is valid!", totalPrice)
            return true
        } else {
            console.error("price isn't valid! please fix it!", totalPrice)
            return false
        }
    }

    const createNewOrder = async ({}) => {

        if (orderValidation() === true) {

            const newOrder = await createNewOrder_DB({totalPrice, restaurant, dbCustomer, orderDishes})
            setCustomerOrders(existingOrders => [...existingOrders, newOrder])
            setOrder(newOrder)

            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ updating dishes after new order was created. each dish will be have the order's id, and its basket id will be removed ~~~~~~~~~~~~~~~~~~~~~")
            const updatedDishes = await updateDishesAfterNewOrder_DB({orderDishes, order: newOrder})
            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ updatedDishes ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(updatedDishes, null, 4))
            setDishes(updatedDishes)
        }

    }

    return (
        <OrderContext.Provider value={{
            createNewOrder,
            customerOrders,
            order
        }}>
            {children}
        </OrderContext.Provider>
    );

};

export default OrderContextProvider

export const useOrderContext = () => useContext(OrderContext)