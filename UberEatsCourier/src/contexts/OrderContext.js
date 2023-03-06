import {createContext, useContext, useEffect, useRef, useState} from "react";
import {DataStore} from "aws-amplify";
import {Customer, Order, Restaurant} from "../models";
import {useCourierContext} from "./CourierContext";

const OrderContext = createContext({})


const OrderContextProvider = ({children}) => {

    const {dbCourier} = useCourierContext()
    const [liveOrder, setLiveOrder] = useState(null)
    const [pressedOrder, setPressedOrder] = useState(null)
    const [ordersToCollect, setOrdersToCollect] = useState([])
    const [restaurant,setRestaurant] = useState(null)
    const [customer,setCustomer] = useState(null)
    const hasInitiated = useRef(false)


    useEffect(() => {

        if (!dbCourier || hasInitiated.current) return

        if (!subscription?.ordersToCollect) {
            subscription.ordersToCollect = DataStore.observeQuery(Order, o => o.and(o => [
                o.courierID.eq("null"),
                o.status.ne("NEW"),
                o.status.ne("DECLINED")
            ])).subscribe(({items, isSynced}) => {
                if (!isSynced) return
                setOrdersToCollect(items)//allow empty array to be inserted
            })
        }

        if (!subscription?.liveOrder) {
            subscription.liveOrder = DataStore.observeQuery(Order, o => o.and(o => [
                o.courierID.eq(dbCourier.id),
                o.status.ne("COMPLETED"),
                o.status.ne("DECLINED")
            ])).subscribe(({items, isSynced}) => {
                if (!isSynced) return
                const order=items?.[0]
                setLiveOrder(order)//allow null\undefined to be inserted
                DataStore.query(Restaurant, order.restaurantID).then(setRestaurant)
                DataStore.query(Customer, order.customerID).then(setCustomer)
            })
        }

        hasInitiated.current = true

        // return ()=>{
        //     subscription.ordersToCollect.unsubscribe()
        //     subscription.liveOrder.unsubscribe()
        // }

    }, [dbCourier])

    useEffect(()=>{
        if(!pressedOrder) return
        DataStore.query(Restaurant, pressedOrder.restaurantID).then(setRestaurant)
        DataStore.query(Customer, pressedOrder.customerID).then(setCustomer)
    },[pressedOrder])

    return (
        <OrderContext.Provider value={{
            liveOrder,
            ordersToCollect,
            setPressedOrder,
            pressedOrder,
            restaurant,
            customer
        }}>
            {children}
        </OrderContext.Provider>
    )
}

export default OrderContextProvider

export const useOrderContext = () => useContext(OrderContext)