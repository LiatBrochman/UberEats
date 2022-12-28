import {createContext, useContext, useState, useEffect} from "react";
import {DataStore} from "aws-amplify";
import {Dish, Order, Restaurant} from "../models";
import {useAuthContext} from "./AuthContext";
import {useBasketContext} from "./BasketContext";
import {useRestaurantContext} from "./RestaurantContext";
import {
    getOrder_ByID,
    getDishes_ByOrder,
    getRestaurant_ByOrder,
    removeDishesFromBasket_DB,
    updateDish_DB,
    updateDishOrderID_DB,
    createNewOrder_DB,
    updateDishesAfterNewOrder_DB,
    getOrders_DB,
} from "./Queries";


const OrderContext = createContext({})
const OrderContextProvider = ({children}) => {

    const _ = require("lodash")
    const {dbCustomer} = useAuthContext()
    const {restaurant} = useRestaurantContext()
    const {totalPrice, dishes, setDishes, basket} = useBasketContext()
    // const [order, setOrder] = useState()
    const [orders, setOrders] = useState()
    // const [dishes, setDishes] = useState()
    // const [restaurant, setRestaurant] = useState()
    // const [hashMapOrders, setHashMapOrders] = useState(
    //     //   --------------------------------------------- [ {order:{},dishes:{},restaurant:{}} ,{order,dishes,restaurant }, {...} ,...  ]
    //
    //     //    [{orderid123:{restaurant:"pooding",dishes:[dish,dish...]},{orderid87567:{restaurant:"pinca",dishes:[dish,dish...]}]
    // )
    const oldSetOrder = ({orders}) => {
        return setOrders(_.cloneDeep([...orders]).map(async order => {

            order.restaurant = await getRestaurant_ByOrder({order})

            order.dishes = await getDishes_ByOrder({order})
            //console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ order.dishes ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(order.dishes,null,4))

            order.quantity = order.dishes.reduce((prev, current) => prev + current.quantity, 0)
            return order
        }))
    }

    // useEffect(() => {
    //     //Init Orders :
    //     dbCustomer &&
    //     getOrders_DB({dbCustomer}).then(setOrders)
    // }, [dbCustomer, basket])
    useEffect(() => {
        //Init Orders :
        dbCustomer &&
        getOrders_DB({dbCustomer}).then(orders=> oldSetOrder({orders}))
    }, [dbCustomer, basket])
    // useEffect(() => {
    //     if (orders && orders instanceof Array && orders[0] instanceof Order) {
    //         // getRestaurant_ByOrder({order}).then(setRestaurant)
    //         // getDishes_ByOrder({order}).then(setDishes)
    //
    //
    //
    //         // const promises=[]
    //         // orders.forEach(order => {
    //         //     promises.push(async()=> await getDishes_ByOrder({order}))
    //         //     promises.push(async() => await getRestaurant_ByOrder({order}))
    //         // })
    //         // const res = Promise.allSettled(promises)
    //         //
    //         // const hashMapInit = _.cloneDeep(orders).map(order=>({ order: order,dishes:res[]})
    //
    //
    //         // const hashMapInit = _.cloneDeep(orders).map(async order => {
    //         //
    //         //
    //         //     const temp = {
    //         //         order: order,
    //         //         dishes: (async () => await getDishes_ByOrder({order}))(),
    //         //         restaurant: (async () => await getRestaurant_ByOrder({order}))()
    //         //     }
    //         //
    //         //
    //         //
    //         //
    //         //     return temp
    //         // })
    //         // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ hashMapInit ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(hashMapInit, null, 4))
    //         // setHashMapOrders(hashMapInit)
    //
    //
    //         // clonedOrders.forEach(order => order )
    //         // setHashMapOrders(  )
    //
    //     }
    // }, [orders])

    const checkIfPriceIsValid = ({totalPrice}) => {
        if (totalPrice && totalPrice > restaurant?.deliveryFee) {
            console.log("price is valid!", totalPrice)
            return true
        } else {
            console.error("price isn't valid! please fix it!", totalPrice)
            return false
        }
    }

    const createOrder = async () => {

        if (checkIfPriceIsValid({totalPrice})) {

            const newOrder = await createNewOrder_DB({totalPrice, restaurant, dbCustomer, dishes})
            // setOrders(existingOrders => [...existingOrders, newOrder])
            setOrder(newOrder)

            const updatedDishes = await updateDishesAfterNewOrder_DB({dishes, order: newOrder})
            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ updatedDishes ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(updatedDishes, null, 4))
            setDishes(updatedDishes)
        }

    }

    return (
        <OrderContext.Provider value={{
            createOrder,
            getOrder_ByID,

            orders
        }}>
            {children}
        </OrderContext.Provider>
    );

};

export default OrderContextProvider

export const useOrderContext = () => useContext(OrderContext)
