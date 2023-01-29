import {createContext, useContext, useEffect, useState} from "react";
import {DataStore} from "aws-amplify";
import {Dish, Order} from "../models";
import {useRestaurantContext} from "./RestaurantContext";


const OrderContext = createContext({});

const OrderContextProvider = ({children}) => {
    const {restaurant} = useRestaurantContext()
    const [order, setOrder] = useState(null)
    const [orders, setOrders] = useState([])
    const [orderDishes, setOrderDishes] = useState([])
    const [countOrderUpdates, setCountOrderUpdates] = useState(0)


    useEffect(() => {
        /**
         * Init "Orders" (orders that are related to the restaurant)
         */
        if (restaurant && orders?.length === 0) {
            DataStore.observeQuery(Order, o => o.restaurantID.eq(restaurant.id))
                .subscribe(({items, isSynced}) => {
                    if (isSynced) {
                        setOrders(items)
                        setCountOrderUpdates(prev => prev + 1)
                    }
                })
        }
    }, [restaurant])


    useEffect(() => {
        /**
         * Init "Order Dishes" (dishes that are related to this restaurant)
         */
        if (restaurant && orderDishes.length === 0) {
            DataStore.observeQuery(Dish, d => d.and(d => [
                d.restaurantID.eq(restaurant.id),
                d.orderID.ne("null")
            ]))
                .subscribe(({items, isSynced}) => {
                    if (isSynced) {
                        setOrderDishes(items)
                    }
                })
        }
    }, [restaurant])


    return (
        <OrderContext.Provider value={{
            order,
            setOrder,
            restaurant,
            orderDishes,
            orders,
            countOrderUpdates
        }}>
            {children}
        </OrderContext.Provider>
    )
}

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext)
