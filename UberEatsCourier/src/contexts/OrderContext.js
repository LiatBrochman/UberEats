import {createContext, useContext, useEffect, useRef, useState} from "react";
import {DataStore} from "aws-amplify";
import {Customer, Dish, Order, Restaurant} from "../models";
import {useCourierContext} from "./CourierContext";
import {cacheImage} from "../myExternalLibrary/CachedImage";


const OrderContext = createContext({})


const OrderContextProvider = ({children}) => {

    const {dbCourier, fixCourierOnInit} = useCourierContext()
    const [ordersToCollect, setOrdersToCollect] = useState([])
    const [liveOrder, setLiveOrder] = useState(null)
    const [completedOrders, setCompletedOrders] = useState([])
    const [pressedOrder, setPressedOrder] = useState(null)
    const hasInitiated = useRef(false)
    const [pressedState, setPressedState] = useState({order: null, restaurant: null, customer: null, dishes: []})

    function pressOn_Order(order) {

        get_Restaurant_Customer_Dishes(order).then(({order, restaurant, customer, dishes}) => {
            setPressedState({order, restaurant, customer, dishes})
            setPressedOrder(order)
        })
    }

    function clearPressedState() {
        setPressedOrder(null)
        setPressedState({order: null, restaurant: null, customer: null, dishes: []})
    }

    async function get_Restaurant_Customer_Dishes(order) {

        const dishes = await DataStore.query(Dish, d => d.orderID.eq(order.id))
        const customer = await DataStore.query(Customer, order.customerID)
        const restaurant = await DataStore.query(Restaurant, order.restaurantID)

        return {order, dishes, customer, restaurant}

    }

    function onFoundLiveOrder(items) {

        if (items.length === 0) {
            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ clearing Live Order ~~~~~~~~~~~~~~~~~~~~~ :")
            setLiveOrder(null)
            clearPressedState()
            return
        }

        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ new LiveOrder was found ~~~~~~~~~~~~~~~~~~~~~ :")
        setLiveOrder(items[0])
        get_Restaurant_Customer_Dishes(items[0]).then(setPressedState)

    }

    // function cacheImages_byOrder(order){
    //
    //     get_Restaurant_Customer_Dishes(order)
    //         .then(({dishes, restaurant})=> {
    //
    //             cacheImagesArray([...dishes.map(d => d.image), restaurant.image])
    //
    //         })
    // }

    async function cacheImages_byOrders(orders) {
        // orders.forEach(order => cacheImages_byOrder(order))
        orders.forEach(({restaurantID}) => DataStore.query(Restaurant, restaurantID)
            .then(({image}) => cacheImage(image)))

        // for await(let order of orders) {
        //     const restaurant = await DataStore.query(Restaurant, order.restaurantID)
        //     await cacheImage(restaurant.image)
        // }

        // const restaurants = orders.map(async order => await DataStore.query(Restaurant, order.restaurantID))

        // .then(restaurant=> cacheImagesArray([restaurant.image])))
    }

    // function cacheImages_ordersToCollect(ordersToCollect) {
    //     cacheImages_byOrders(ordersToCollect)
    // }

    useEffect(() => {

        if (!dbCourier || hasInitiated.current) return

        fixCourierOnInit()

        if (!subscription?.ordersToCollect) {
            subscription.ordersToCollect = DataStore.observeQuery(Order, o => o.and(o => [
                o.courierID.eq("null"),
                o.status.ne("NEW"),
                o.status.ne("DECLINED")
            ])).subscribe(({items, isSynced}) => {
                if (!isSynced) return
                console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ new orders are being observed! ~~~~~~~~~~~~~~~~~~~~~ :")
                cacheImages_byOrders(items)
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

        if (!subscription?.completedOrders) {
            subscription.completedOrders = DataStore.observeQuery(Order, o => o.and(o => [
                o.courierID.eq(dbCourier.id),
                o.or(o => [
                    o.status.eq("COMPLETED"),
                    o.status.eq("DECLINED")
                ])
            ])).subscribe(({items, isSynced}) => {
                if (!isSynced) return
                setCompletedOrders(items)
            })
        }

        hasInitiated.current = true

    }, [dbCourier])


    return (
        <OrderContext.Provider value={{

            clearPressedOrder: clearPressedState,
            pressOn_Order,
            setLiveOrder,
            liveOrder,
            ordersToCollect,
            setPressedOrder,
            pressedOrder,
            pressedState
        }}>
            {children}
        </OrderContext.Provider>
    )
}

export default OrderContextProvider

export const useOrderContext = () => useContext(OrderContext)