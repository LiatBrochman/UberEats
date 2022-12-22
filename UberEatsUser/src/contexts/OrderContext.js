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
    const {totalPrice, dishes, setDishes ,setBasket} = useBasketContext()
    const [orders, setOrders] = useState([])

    useEffect(() => {
        dbCustomer &&
        DataStore.query(Order, o => o.customerID.eq(dbCustomer.id))
             .then(result =>{ 
                 if(!result) return null
                 if(result instanceof Array ) {
                    return result.filter(entity=>entity.isDeleted===false)
                 }else{
                     return result
                 }
             })
            .then(existingOrders => {
            existingOrders instanceof Array &&
            existingOrders[0] instanceof Order &&
            setOrders(() => {
                console.log("\n\n ~~~~~~~~~ existingOrders ~~~~~~~~~ :", existingOrders)
                return existingOrders
            })

        })
    }, [dbCustomer])

    function checkIfPriceIsValid({totalPrice}) {
        if (totalPrice && totalPrice > restaurant?.deliveryFee) {
            console.log("price is valid!")
            return true
        } else {
            console.error("price isn't valid! please fix it!", totalPrice)
            return false
        }
    }

    const updateDishOrderID_DB = async ({dish, order}) => {
        return await DataStore.save(Dish.copyOf(
            dish, updated => {
                updated.orderID = order.id
            }))
    }
    const createNewOrder_DB = async () => {
        //create the order
        return await DataStore.save(new Order({
            status: "NEW",
            total: parseFloat(totalPrice),
            restaurantLocation: restaurant.location,
            customerLocation: dbCustomer.location,
            isDeleted: false,
            customerID: dbCustomer.id,
            restaurantID: restaurant.id,
            dishes: dishes
        }))
    }

    const updateDishes_DB = async({newOrder})=>{
        //every dish that is related to this order :: dish.orderID = this order id
        return dishes.map(async d => {
            const updatedDish = await updateDishOrderID_DB({dish:d, order:newOrder})
            console.log("\n\n ~~~~~~~~ updatedDish ~~~~~~~~~ :", updatedDish)
        })
    }
    const createOrder = async () => {

        if(checkIfPriceIsValid({totalPrice}) ){
            const newOrder =  await createNewOrder_DB()
            setOrders(existingOrders=> [...existingOrders,newOrder])
            const updatedDishes = await updateDishes_DB({newOrder})
            console.log("\n\n ~~~~~~~~~!!!!!!!!!!!!!!! updatedDishes ~~~~~~~~~ :",updatedDishes)
            setDishes(updatedDishes)
            setBasket(null)
            // setDishes(existingDishes=> existingDishes.map(dish=> dish.orderID=newOrder.id))
        }

        // //update context
        // setOrders([...orders, newOrder])
        // setDishes([...dishes])
        //
        // //delete basket
        // await removeDishFromBasket()
    };

    const getOrder = async (id) => {
        return await DataStore.query(Order, id)
             .then(result =>{ 
                 if(!result) return null
                 if(result instanceof Array ) {
                    return result.filter(entity=>entity.isDeleted===false)
                 }else{
                     return result
                 }
             })

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
