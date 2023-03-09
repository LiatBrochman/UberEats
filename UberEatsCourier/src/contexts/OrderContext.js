import {createContext, useContext, useEffect, useRef, useState} from "react";
import {DataStore} from "aws-amplify";
import {Customer, Dish, Order, Restaurant} from "../models";
import {useCourierContext} from "./CourierContext";

const OrderContext = createContext({})


const OrderContextProvider = ({children}) => {

    const {dbCourier, fixCourierOnInit} = useCourierContext()
    const [ordersToCollect, setOrdersToCollect] = useState([])
    const [liveOrder, setLiveOrder] = useState(null)
    const [pressedOrder, setPressedOrder] = useState(null)
    const [pressedRestaurant, setPressedRestaurant] = useState(null)
    const [pressedCustomer, setPressedCustomer] = useState(null)
    const [pressedDishes, setPressedDishes] = useState([])
    const hasInitiated = useRef(false)
    const pressed = useRef({
        order: pressedOrder,
        restaurant: pressedRestaurant,
        customer: pressedCustomer,
        dishes: pressedDishes
    })
    const [pressedState, setPressedState] = useState({order: null, restaurant: null, customer: null, dishes: []})

    function pressOn_Order(order) {

        get_Restaurant_Customer_Dishes(order).then(({order, restaurant, customer, dishes}) => {
            setPressedState({order, restaurant, customer, dishes})
            setPressedDishes(dishes)
            setPressedCustomer(customer)
            setPressedRestaurant(restaurant)
            setPressedOrder(order)
        })
        // setPressedOrder(() => {
        //     pressed.current.order = order
        //     setPressedState(prev => ({...prev, order: order}))
        //     return order
        // })
        // DataStore.query(Restaurant, order.restaurantID).then(restaurant => {
        //     pressed.current = restaurant
        //     setPressedState(prev => ({...prev, restaurant: restaurant}))
        //     setPressedRestaurant(restaurant)
        // })
        // DataStore.query(Customer, order.customerID).then(customer => {
        //     pressed.current = customer
        //     setPressedState(prev => ({...prev, customer: customer}))
        //     setPressedCustomer(customer)
        // })
        // DataStore.query(Dish, d => d.orderID.eq(order.id)).then(dishes => {
        //     pressed.current = dishes
        //     setPressedState(prev => ({...prev, dishes: dishes}))
        //     setPressedDishes(dishes)
        // })
    }

    function clearPressedOrder() {
        setPressedOrder(null)
        setPressedRestaurant(null)
        setPressedCustomer(null)
        setPressedDishes([])

        pressed.current = {order: null, restaurant: null, customer: null, dishes: []}
    }

    async function get_Restaurant_Customer_Dishes(order) {

        const dishes = await DataStore.query(Dish, d => d.orderID.eq(order.id))

        const customer = await DataStore.query(Customer, order.customerID)

        const restaurant = await DataStore.query(Restaurant, order.restaurantID)

        return {order, dishes, customer, restaurant}

    }

    function onFoundLiveOrder(items) {

        if (items.length === 0) {
            return
        }
        setLiveOrder(items[0])
        get_Restaurant_Customer_Dishes(items[0]).then(setPressedState)

    }


    useEffect(() => {

        if (!dbCourier || hasInitiated.current) return
//|| (subscription?.ordersToCollect && subscription?.liveOrder)
//         if (!dbCourier) return

        fixCourierOnInit()

        if (!subscription?.ordersToCollect) {
            subscription.ordersToCollect = DataStore.observeQuery(Order, o => o.and(o => [
                o.courierID.eq("null"),
                o.status.ne("NEW"),
                o.status.ne("DECLINED")
            ])).subscribe(({items, isSynced}) => {
                if (!isSynced) return
                console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ new orders are being observed! ~~~~~~~~~~~~~~~~~~~~~ :")
                setOrdersToCollect(items)
            })
        }

        if (!subscription?.liveOrder) {
            subscription.liveOrder = DataStore.observeQuery(Order, o => o.and(o => [
                o.courierID.eq(dbCourier.id),
                o.status.ne("COMPLETED"),
                o.status.ne("DECLINED")
            ])).subscribe(({items, isSynced}) => {
                if (!isSynced) return
                onFoundLiveOrder(items)
            })
        }

        hasInitiated.current = true

        // return ()=>{
        //     subscription.ordersToCollect.unsubscribe()
        //     subscription.liveOrder.unsubscribe()
        // }

    }, [dbCourier])

    // useEffect(() => {
    //     if (!pressedOrder) return
    //     DataStore.query(Restaurant, pressedOrder.restaurantID).then(setPressedRestaurant)
    //     DataStore.query(Customer, pressedOrder.customerID).then(setPressedCustomer)
    //     DataStore.query(Dish,d=>d.orderID.eq(pressedOrder.id)).then(setPressedDishes)
    //
    // }, [pressedOrder])

    return (
        <OrderContext.Provider value={{

            clearPressedOrder,
            pressOn_Order,
            setLiveOrder,
            liveOrder,
            ordersToCollect,
            setPressedOrder,
            pressedOrder,
            pressedRestaurant,
            pressedCustomer,
            pressedDishes,
            pressed, pressedState
        }}>
            {children}
        </OrderContext.Provider>
    )
}

export default OrderContextProvider

export const useOrderContext = () => useContext(OrderContext)