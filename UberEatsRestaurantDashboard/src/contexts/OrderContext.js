import {createContext, useState, useContext, useEffect} from "react";
import {DataStore} from "aws-amplify";
import {Order, Dish, Restaurant, Customer} from "../models";
import {useAuthContext} from "./AuthContext";
//import {useAuthContext} from "./AuthContext";
//import * as Location from "expo-location";
//import {useNavigate} from "react-router-dom";

const OrderContext = createContext({});

const OrderContextProvider = ({children}) => {

    const [orders, setOrders] = useState([])
    const [order, setOrder] = useState({})
    const [orderDishes, setOrderDishes] = useState([])
    const [restaurantDishes, setRestaurantDishes] = useState([])
    const [restaurant, setRestaurant] = useState({})
    const {dbOwner} = useAuthContext()

    useEffect(() => {
        if (dbOwner) {
            // subscription.restaurant =
                DataStore.observeQuery(Restaurant, r => r?.ownerID.eq(dbOwner.id))
                .subscribe(({items}) => setRestaurant(items[0]))
        }
    }, [dbOwner])

    useEffect(() => {
        if (restaurant) {
            // subscription.orders =
                DataStore.observeQuery(Order, o => o.restaurantID.eq(restaurant.id))
                .subscribe(({items}) => setOrders(items))
            // subscription.dishes =
                DataStore.observeQuery(Dish, d => d.restaurantID.eq(restaurant.id))
                .subscribe(({items}) => {

                    setRestaurantDishes(items.filter(dish => dish.originalID === "null"))
                    setOrderDishes(items.filter(dish => dish.originalID !== "null"))
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
        }}>
            {children}
        </OrderContext.Provider>
    )
}

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext)
