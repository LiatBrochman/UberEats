import {createContext, useState, useEffect, useContext} from "react";
import {Auth, DataStore} from "aws-amplify";
import {Courier, Order, OrderDish, Restaurant, User} from "../models";
import {useAuthContext} from "./AuthContext";
import {useRoute} from "@react-navigation/native";

const OrderContext = createContext({});

const OrderContextProvider = ({children}) => {
    const {dbCourier} = useAuthContext();
    const [order, setOrder] = useState();
    const [user, setUser] = useState();
    const [restaurant, setRestaurant] = useState(null);
    const [orderDishes, setOrderDishes] = useState([]);
    //const [dishes, setDishes] = useState([]);
    // const route = useRoute();
    // const id = route.params?.id;

    const fetchOrder = (id) => {
        if (id) {
         //const fetchedOrder = await DataStore.query(Order, id);
        DataStore.query(Order, id).then(setOrder)
        }
        //setOrder(fetchedOrder);
    }

    const fetchUser = (order) => {
            if (order) {
                DataStore.query(User, order.userID).then(setUser)
                DataStore.query(Restaurant, order.orderRestaurantId).then(setRestaurant)
                DataStore.query(OrderDish, od => od.orderID.eq(order.id)).then(setOrderDishes)
            }
      //  setUser(fetchedUser);
    }

    const acceptOrder = (order) => {
// updated the order, and change status, and assign the courier
        DataStore.save(
            Order.copyOf(order, (updated) => {
                updated.status = "ACCEPTED";// update to "ACCEPTED"
                updated.Courier = dbCourier;

            })
        ).then(setActiveOrder);
    }

    return (
        <OrderContext.Provider value={{acceptOrder, order, user, fetchOrder, fetchUser, restaurant, orderDishes}}>
            {children}
        </OrderContext.Provider>
    )
}

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext)
