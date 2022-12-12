import {createContext, useContext, useState, useEffect} from "react";
import {DataStore} from "aws-amplify";
import {Order} from "../models";
import {useAuthContext} from "./AuthContext";
import {useBasketContext} from "./BasketContext";

const OrderContext = createContext({});

const OrderContextProvider = ({children}) => {

    const {dbCustomer} = useAuthContext();
    const {restaurant, totalPrice, basket , dishes ,removeDishFromBasket} = useBasketContext();
    const [orders, setOrders] = useState();

    useEffect(() => {
        dbCustomer &&
        DataStore.query(Order, o => o.CustomerID.eq(dbCustomer.id)).then(existingOrders=> {
            if(existingOrders) setOrders(existingOrders)
        });
    }, [dbCustomer]);

    function validateTotalPrice(totalPrice) {
        return (totalPrice && typeof totalPrice === "number" && totalPrice > restaurant?.deliveryFee)
    }

    const createOrder = async () => {
        if (!validateTotalPrice(totalPrice)) {
            console.error("wrong total price!!", totalPrice)
            return null
        }
        //create the order
        const newOrder = await DataStore.save(new Order({
            status: "NEW",
            total: totalPrice,
            restaurantLocation:restaurant.location,
            customerLocation:dbCustomer.location,
            isDeleted: false,
            customerID: dbCustomer.id,
            restaurantID: restaurant.id,
            dishes:dishes
            }));

        //add all dishes to the order

        // await Promise.allSettled(
        //     basketDishes.map((basketDish) =>
        //         DataStore.save(
        //             new OrderDish({
        //                 quantity: basketDish.quantity,
        //                 orderID: newOrder.id,
        //                 Dish: basketDish.Dish,
        //             })
        //         )
        //     )
        // );

        //update context
        setOrders([...orders, newOrder]);

        //delete basket
        await removeDishFromBasket()
    };


    const getOrder = async (id) => {
        return await DataStore.query(Order, id)
        // const order = await DataStore.query(Order, id);
        // const orderDishes = await DataStore.query(OrderDish, (od) =>
        //     od.orderID.eq(id));
        //
        // return {...order, dishes: orderDishes};
    };

    return (
        <OrderContext.Provider value={{createOrder, orders, getOrder}}>
            {children}
        </OrderContext.Provider>
    );

};

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext);
