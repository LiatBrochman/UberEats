import {createContext, useContext, useEffect, useState} from "react";
import {useOrderContext} from "./OrderContext";
import {DataStore} from "aws-amplify";
import {Courier} from "../models";
import {subscription} from "../screens/HomeScreen";

const CourierContext = createContext({})


const CourierContextProvider = ({children}) => {
    const {orders} = useOrderContext()
    const [courier, setCourier] = useState({})


    useEffect(() => {
        if (orders) {

            // const ListOfCouriersID = orders.map(o=> o?.courierID && o.courierID !== "null" && o.courierID)
            const orderWithCourier = orders?.length > 0 && orders.find(o => {
                if (o?.courierID && o?.courierID !== "null") {
                    return o?.courierID
                }
            })
            if (orderWithCourier && orderWithCourier?.courierID) {

                subscription.courier = DataStore.observeQuery(Courier, c=> c.id.eq(orderWithCourier.courierID))
                    .subscribe(({items}) => {
                        setCourier(items?.[0])
                    })
            }
        }
        // return subscription?.courier?.unsubscribe()
    }, [orders])


    // const getLiveOrders = (orders) => {
    //     return orders &&
    //         orders?.length > 0 &&
    //         orders.filter(order => order.status !== "COMPLETED" && order.status !== "DECLINED")
    // }
    // const getPickedUpOrders = (orders) => {
    //     return orders &&
    //         orders?.length > 0 &&
    //         orders.filter(order => order.status === "PICKED_UP")
    // }
    // useEffect(() => {
    //     /**
    //      listen to couriers
    //      */
    //     // const liveOrders = getLiveOrders(orders)
    //     // if (liveOrders && liveOrders?.length > 0) {
    //     //
    //     //     const pickedUp_Orders = liveOrders.filter(order => order.status === "PICKED_UP")
    //     if (orders) {
    //         const pickedUp_Orders = getPickedUpOrders(orders)
    //         if (pickedUp_Orders.length > 0) {
    //             // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ found pickedUp_Orders! ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(pickedUp_Orders,null,4))
    //             // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ found pickedUp_Orders! ~~~~~~~~~~~~~~~~~~~~~")
    //
    //             const ListOfCouriersID = pickedUp_Orders.map(o => o?.courierID)
    //
    //             // DataStore.query(Courier, c => c.and(c => [ c.isActive.eq(true),c.id.eq(ListOfCouriersID[0])])).then(res => {
    //             //     console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ DataStore.query(Courier) ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(res, null, 4))
    //             //     setCouriers(res)
    //             // })
    //
    //             DataStore.observeQuery(Courier, c => c.and(c => [ c.isActive.eq(true),c.id.eq(ListOfCouriersID[0])])).subscribe(({items}) => {
    //                 // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ DataStore.query(Courier) ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(items, null, 4))
    //                 setCouriers(items)
    //             })
    //             // subscription.couriers = DataStore.observeQuery(Courier, c => c.and(c => [
    //             //     c.isActive.eq(true),
    //             //     c.or(c=>[
    //             //         c.id.eq(ListOfCouriersID[0].id),
    //             //     ]),
    //             //
    //             // ])).subscribe(({items}) => {
    //             //         console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ couriers ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(items,null,4))
    //             //         setCouriers(items)
    //             //     })
    //
    //         }
    //     }
    //     // return subscription?.couriers?.unsubscribe()
    //
    // }, [orders])


    return (
        <CourierContext.Provider value={{
            courier
        }}>
            {children}
        </CourierContext.Provider>
    );

};

export default CourierContextProvider

export const useCourierContext = () => useContext(CourierContext)