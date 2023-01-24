import {createContext, useContext, useEffect, useState} from "react";
import {DataStore} from "aws-amplify";
import {Dish, Order} from "../models";
import {useRestaurantContext} from "./RestaurantContext";
//import {useAuthContext} from "./AuthContext";
//import * as Location from "expo-location";
//import {useNavigate} from "react-router-dom";

const OrderContext = createContext({});

const OrderContextProvider = ({children}) => {
    const {restaurant} = useRestaurantContext()
    const [order, setOrder] = useState(null)
    const [orders, setOrders] = useState([])
    const [orderDishes, setOrderDishes] = useState([])


    useEffect(() => {
        if (restaurant) {
            if (orders?.length === 0)
                // subscription.orders =
            {
                DataStore.observeQuery(Order, o => o.restaurantID.eq(restaurant.id))
                    .subscribe(({items, isSynced}) => {
                        if (isSynced) {
                            // console.log("subscribing to orders")
                            setOrders(items)
                        }
                    })
            }
            if (orderDishes.length === 0)
                // subscription.orderDishes =
            {
                DataStore.observeQuery(Dish, d => d.and(d => [
                    d.restaurantID.eq(restaurant.id),
                    d.orderID.ne("null")
                ]))
                    .subscribe(({items, isSynced}) => {
                        if (isSynced) {
                            // console.log("subscribing to dishes of orders")
                            setOrderDishes(items)
                        }
                    })
            }
        }
    }, [restaurant])


    return (
        <OrderContext.Provider value={{
            order,
            setOrder,
            restaurant,
            orderDishes,
            orders,
        }}>
            {children}
        </OrderContext.Provider>
    )
}

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext)
