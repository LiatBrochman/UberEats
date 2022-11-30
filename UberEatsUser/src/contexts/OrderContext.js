import {createContext, useState, useEffect, useContext} from "react";
import {DataStore} from 'aws-amplify';
import {Order, OrderDish, Basket, Restaurant, Dish} from "../models";
import {useAuthContext} from "./AuthContext";
import {useBasketContext} from "./BasketContext";

const OrderContext = createContext({});

const AuthContextProvider = ({children}) => {
    const {dbUser} = useAuthContext();
    const {restaurant, totalPrice, basketDishes, basket} = useBasketContext()

    const [orders, setOrders] = useState([]);

    useEffect(()=>{
       DataStore.query(Order, (o) => o.userID.eq(dbUser.id)).then(setOrders);
    })

    const createOrder = async () => {
        //create the order
        const newOrder = await DataStore.save(new Order({
            userID: dbUser.id,
            Restaurant: restaurant,
            status: 'NEW',
            total: totalPrice,
        }))

        //add all basketDishes to the order
        await Promise.all(basketDishes.map(basketDish => DataStore.save(new OrderDish({
            quantity: basketDish.quantity,
            orderID: newOrder.id,
            Dish: basketDish.Dish,
        }))))

        //delete the basket
        await DataStore.delete(basket);

        setOrders([...orders, newOrder]);
    }

    const getOrder = async (id) => {
        const order = await DataStore.query(Order, id);
        const orderDishes = await DataStore.query(OrderDish, od => od.orderID.eq(id));

        return { ...order, dishes: orderDishes }
    }

    return (
        <OrderContext.Provider value={{createOrder, orders, getOrder}}>
            {children}
        </OrderContext.Provider>
    )

};

export default AuthContextProvider;

export const useOrderContext = () => useContext(OrderContext)
