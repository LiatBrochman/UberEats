import {createContext, useContext, useEffect, useState} from "react";
import {DataStore} from "aws-amplify";
import {Dish, Order} from "../models";
import {useRestaurantContext} from "./RestaurantContext";


const OrderContext = createContext({})

const OrderContextProvider = ({children}) => {
    const subscription = {}
    const {restaurant} = useRestaurantContext()
    const [order, setOrder] = useState(null)
    const [orders, setOrders] = useState([])
    const [orderDishes, setOrderDishes] = useState([])
    const [countOrderUpdates, setCountOrderUpdates] = useState(0)
    // const [courierID, setCourierID] = useState(null)
    const [courier, setCourier] = useState(null)
    const [customer, setCustomer] = useState(null)


    useEffect(() => {
        /**
         * Init "Order Dishes" (dishes that are related to this restaurant)
         */
        if (restaurant && orderDishes.length === 0) {
            DataStore.observeQuery(Dish, d => d.and(d => [
                d.restaurantID.eq(restaurant.id),
                d.orderID.ne("null")
            ]))
                .subscribe(({items, isSynced}) => {
                    if (isSynced) {
                        setOrderDishes(items)
                    }
                })
        }

        /**
         * Init "Orders" (orders that are related to the restaurant)
         */
        if (restaurant && orders?.length === 0) {
            DataStore.observeQuery(Order, o => o.restaurantID.eq(restaurant.id))
                .subscribe(({items, isSynced}) => {
                    if (isSynced) {
                        setOrders(items)
                        setCountOrderUpdates(prev => prev + 1)
                    }
                })
        }
    }, [restaurant])

    /**
     * Init Customer & Courier (for the specific Order)
     */
    useEffect(() => {

        if (order) {

            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ courier id ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(order?.courierID, null, 4))

            DataStore.query(Customer, order.customerID).then(setCustomer)

            if (order?.courierID && order.courierID !== 'null') {
                subscription.courier = DataStore.observeQuery(Courier, c => c.id.eq(order.courierID))
                    .subscribe(({items, isSynced}) => {
                            isSynced && setCourier(items[0])
                        }
                    )
            }

            if (order.courierID === 'null' && courier) {
                subscription?.courier?.unsubscribe()
                setCourier(null)
            }

        }
    }, [order])

    // useEffect(() => {
    //
    //     order && DataStore.query(Customer, order?.customerID).then(setCustomer)
    //
    //     if (order?.courierID && order.courierID !== "null") {
    //         setCourierID(order.courierID)
    //     }
    //
    // }, [order])
    // useEffect(() => {
    //     if (courierID && courierID !== "null") {
    //         DataStore.observeQuery(Courier, c => c.id.eq(order.courierID))
    //             .subscribe(({items, isSynced}) => {
    //                     isSynced && setCourier(items[0])
    //                 }
    //             )
    //     }
    // }, [courierID])

    const getOrder = (orderID) => {
        if (orders.length > 0) {
            return setOrder(orders.find(o => o.id === orderID))
        } else {
            return DataStore.observeQuery(Order, o => o.id.eq(orderID))
                .subscribe(({items, isSynced}) => isSynced && setOrder(items[0]))
        }
    }


    return (
        <OrderContext.Provider value={{
            order,
            setOrder,
            restaurant,
            orderDishes,
            orders,
            countOrderUpdates,
            courier,
            customer,
            setCustomer,
            getOrder
        }}>
            {children}
        </OrderContext.Provider>
    )
}

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext)
