import {createContext, useContext, useState, useEffect} from "react";
import {DataStore} from "aws-amplify";
import {Dish, Order} from "../models";
import {useAuthContext} from "./AuthContext";
import {useBasketContext} from "./BasketContext";
import {useRestaurantContext} from "./RestaurantContext";

const OrderContext = createContext({})

const OrderContextProvider = ({children}) => {

    const {dbCustomer} = useAuthContext()
    const {restaurant} = useRestaurantContext()
    const {totalPrice, dishes} = useBasketContext()
    const [orders, setOrders] = useState([])

    useEffect(() => {
        dbCustomer &&
        DataStore.query(Order, o => o.customerID.eq(dbCustomer.id)).then(existingOrders => {
            existingOrders instanceof Array &&
            existingOrders[0] instanceof Order &&
            setOrders(() => {
                console.log("\n\n ~~~~~~~~~ existingOrders ~~~~~~~~~ :", existingOrders)
                return existingOrders
            })

        })
    }, [dbCustomer])

    function validateTotalPrice(totalPrice) {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~typeof totalPrice ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(typeof totalPrice, null, 4))
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ restaurant?.deliveryFee ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(restaurant?.deliveryFee, null, 4))

        return (totalPrice && totalPrice > restaurant?.deliveryFee)
    }

    const updateDishOrderID_DB = async (dish, order) => {
        return await DataStore.save(Dish.copyOf(
            dish, updated => {
                updated.orderID = order.id
            }))
    }
    const createOrder = async () => {
        if (!validateTotalPrice(totalPrice)) {
            console.error("wrong total price!!", totalPrice)
            return null
        }
        //create the order
        const newOrder = await DataStore.save(new Order({
            status: "NEW",
            total: parseFloat(totalPrice),
            restaurantLocation: restaurant.location,
            customerLocation: dbCustomer.location,
            isDeleted: false,
            customerID: dbCustomer.id,
            restaurantID: restaurant.id,
            dishes: dishes
        }))
        dishes.map(async d => {
            const updatedDish = await updateDishOrderID_DB(d, newOrder)
            console.log("\n\n ~~~~~~~~ updatedDish ~~~~~~~~~ :", updatedDish)
        })

        // //update context
        setOrders([...orders, newOrder])
        // setDishes([...dishes])
        //
        // //delete basket
        // await removeDishFromBasket()
    };

    const getOrder = async (id) => {
        return await DataStore.query(Order, id)
        // const order = await DataStore.query(Order, id);
        // const orderDishes = await DataStore.query(OrderDish, (od) =>
        //     od.orderID.eq(id));
        //
        // return {...order, dishes: orderDishes};
    }

    return (
        <OrderContext.Provider value={{createOrder, orders, getOrder}}>
            {children}
        </OrderContext.Provider>
    );

};

export default OrderContextProvider

export const useOrderContext = () => useContext(OrderContext)
