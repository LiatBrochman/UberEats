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
    const {totalPrice, dishes, removeDishFromBasket,setDishes} = useBasketContext()
    const [orders, setOrders] = useState()

    useEffect(() => {
        dbCustomer &&
        DataStore.query(Order, o => o.customerID.eq(dbCustomer.id)).then(existingOrders => {
            if (existingOrders) setOrders(existingOrders)
        });
    }, [dbCustomer])

    function validateTotalPrice(totalPrice) {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~typeof totalPrice ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(typeof totalPrice,null,4))
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ restaurant?.deliveryFee ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(restaurant?.deliveryFee,null,4))

        return (totalPrice && totalPrice > restaurant?.deliveryFee)
    }
    const updatingDishesOrderIDs=async (newOrder)=>{
        const result = dishes.map(async originDish=>await DataStore.save(Dish.copyOf(originDish,updated=>{
                updated.orderID = newOrder.id
            }))
        )
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ after updating Dishes Orders IDs ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(result,null,4))
        return  result
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
        const dishes = await updatingDishesOrderIDs()

        //update context

        setOrders([...orders, newOrder])
        setDishes([...dishes])

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
    }

    return (
        <OrderContext.Provider value={{createOrder, orders, getOrder}}>
            {children}
        </OrderContext.Provider>
    );

};

export default OrderContextProvider

export const useOrderContext = () => useContext(OrderContext)
