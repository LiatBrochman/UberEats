// import {createContext, useContext, useEffect, useRef, useState} from "react";
// import {DataStore} from "aws-amplify";
// import {Courier, Customer, Dish, Order, Restaurant} from "../models";
// import {useAuthContext} from "./AuthContext";
// import {subscription} from "../screens/OrdersScreen";
//
//
// const OrderContext = createContext({})
//
// const OrderContextProvider = ({children}) => {
//
//     const {dbCourier, setDbCourier} = useAuthContext()
//
//     const [order, setOrder] = useState(null)
//     const [dishes, setDishes] = useState([])
//     const [customer, setCustomer] = useState(null)
//     const [restaurant, setRestaurant] = useState(null)
//     const [driverLocation, setDriverLocation] = useState(null)
//     const [ORCD, setORCD] = useState([])
//     const [activeORCD, setActiveORCD] = useState([])
//     const [activeOrdersUpdates, setActiveOrdersUpdates] = useState(0)
//     const [ORCDupdates, setORCDupdates] = useState(0)
//     const [liveOrder, setLiveOrder] = useState(null)
//     const ref = useRef({
//         liveOrder: null,
//         ETA: [],
//         distance: 0
//     })
//
//     const onOrdersEvent = async (orders) => {
//         const promises = []
//
//         orders.forEach(order => {
//
//             promises.push(new Promise(async (resolve) => {
//
//                 const restaurant = await DataStore.query(Restaurant, order.restaurantID)
//                 const dishes = await DataStore.query(Dish, d => d.orderID.eq(order.id))
//                 const customer = await DataStore.query(Customer, order.customerID)
//                 if (restaurant && dishes && customer) {
//
//                     resolve({order, restaurant, dishes, customer})
//
//                 } else {
//                     console.error("REJECTED!! couldn't find restaurant or dishes or customer:", restaurant, dishes, customer)
//                 }
//             }))
//         })
//
//         Promise.allSettled(promises).then((results) => {
//             setORCD(results.map(res => res.value))
//             setORCDupdates(prev => prev + 1)
//         })
//     }
//     const onLiveOrderEvent = async (newLiveOrder) => {
//         console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ newLiveOrder ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(newLiveOrder,null,4))
//
//         ref.current.liveOrder = newLiveOrder
//         setLiveOrder(newLiveOrder)
//     }
//
//     useEffect(() => {
//
//         /**
//          * set up the
//          *
//          * ORCD =
//          * [
//          *      { "order":{}, "restaurant":{}, "customer":{}, "dishes":[] },
//          *      {...},
//          *      {...},
//          *      {...}
//          * ]
//          *
//          *
//          * O: orders = listening to all the active + available orders
//          * R: restaurant = 1 restaurant, related to the order.
//          * C: customer = 1 customer,  related to the order.
//          * D: dishes = array of dishes, related to the order.
//          *
//          *
//          * ---------**only orders are being observed, while the rest are being queried whenever order is being updated.**----------*/
//
//
//         if (!dbCourier || subscription.hasOwnProperty("ORCD")) return;
//
//         subscription.ORCD = DataStore.observeQuery(Order, o => o.and(o => [
//                 o.isDeleted.eq(false),
//                 o.or(o => [
//                     o.courierID.eq(dbCourier.id),
//                     o.courierID.eq('null')
//                 ])
//             ]
//         )).subscribe(async ({items, isSynced}) => {
//             if (!isSynced) return
//
//             await onOrdersEvent(items)
//
//         })
//         // startWatchingLocation(setDriverLocation, whenDriverIsMoving).then(sub => subscription.watchPosition = sub)
//         // startWatchingDriverLocation().then(sub => subscription.watchPosition = sub)
//
//
//         // return () => {
//         //     subscription?.ORCD?.unsubscribe()
//         //     subscription?.watchPosition?.remove()
//         // }
//
//     }, [dbCourier])
//     useEffect(() => {
//         /**
//          * find out if there is any live order (and subscribe to it)
//          *
//          * exit if there is no courier \ already has a live order
//          */
//         if (!dbCourier || liveOrder) return
//
//         setLiveOrder(()=>{
//           const liveOrder=
//               ORCD.find(({order})=>order.courierID===dbCourier.id && (order.status!=="COMPLETED" || order.status!=="DECLINED" )).order
//
//             subscription.liveOrder = DataStore.observe(Order,liveOrder.id).subscribe(msg => {
//                 console.log(msg.model, msg.opType, msg.element)
//             })
//             return liveOrder
//         })
//
//
//
//
//         // subscription.liveOrder = DataStore.observeQuery(Order, o => o.and(o => [
//         //     o.isDeleted.eq(false),
//         //     o.courierID.eq(dbCourier.id),
//         //     o.or(o => [
//         //         o.status.eq("ACCEPTED"),
//         //         o.status.eq("COOKING"),
//         //         o.status.eq("READY_FOR_PICKUP"),
//         //         o.status.eq("PICKED_UP")
//         //     ])
//         // ])).subscribe(async ({items: [foundLiveOrder], isSynced}) => {
//         //     if (foundLiveOrder && isSynced) {
//         //         await onLiveOrderEvent(foundLiveOrder)
//         //     }
//         // })
//
//     }, [ORCDupdates])
//
//     useEffect(() => {
//         /**
//          * set up all the active orders (available orders + the assigned order if there is any)
//          */
//         if (ORCD.length === 0) return
//
//         const filteredORCD = ORCD.filter((orcd) => {
//             const {order} = orcd
//             if (
//                 order.status === "COOKING" ||
//                 order.status === "ACCEPTED" ||
//                 order.status === "READY_FOR_PICKUP" ||
//                 (order.courierID === dbCourier?.id && order.status !== "COMPLETED")
//             ) {
//                 return orcd
//             }
//         })
//         setActiveORCD(filteredORCD)
//         setActiveOrdersUpdates(prev => prev + 1)
//
//     }, [countOrderUpdates])
//
//
//     // const whenDriverIsMoving = async (coords) => {
//     //     if (!dbCourier) return
//     //     /**
//     //      * every 100meters : update driver location both in the DB and in DriverLocation's state
//     //      */
//     //     // setDriverLocation(coords)
//     //     DataStore.save(Courier.copyOf(await DataStore.query(Courier, dbCourier.id),
//     //         updated => {
//     //             updated.location = {
//     //                 lat: coords.latitude,
//     //                 lng: coords.longitude
//     //             }
//     //
//     //             if (ref.current.liveOrder) {
//     //
//     //                 switch (ref.current.liveOrder.status) {
//     //                     case "ACCEPTED":
//     //                     case "COOKING":
//     //                     case "READY_FOR_PICKUP":
//     //                     case "PICKED_UP":
//     //
//     //                         switch (ref.current.ETA.length) {
//     //
//     //                             case 0:
//     //                                 break;
//     //
//     //                             case 1:
//     //                                 updated.timeToArrive = ref.current.ETA
//     //                                 updated.destinations = [ref.current.liveOrder.customerLocation.address]
//     //                                 break;
//     //
//     //                             case 2:
//     //                                 updated.timeToArrive = ref.current.ETA
//     //                                 updated.destinations = [ref.current.liveOrder.restaurantLocation.address, ref.current.liveOrder.customerLocation.address]
//     //                                 break;
//     //                         }
//     //                         break;
//     //
//     //                     case "COMPLETED":
//     //                     case "DECLINED":
//     //                     case "NEW":
//     //                         break;
//     //
//     //                     default:
//     //                         console.error("default on liveOrder.status", ref.current.liveOrder.status)
//     //
//     //                 }
//     //             }
//     //
//     //         })).then(setDbCourier)
//     //
//     //
//     // }
//
//     const assignToCourier = async ({order}) => {
//         DataStore.save(
//             Order.copyOf(await DataStore.query(Order, order.id), (updated) => {
//                 updated.courierID = dbCourier.id
//             })
//         ).then(assignedOrder => {
//             ref.current.liveOrder = assignedOrder
//             setLiveOrder(assignedOrder)
//         })
//
//         DataStore.save(Courier.copyOf(await DataStore.query(Courier, dbCourier.id), updated => {
//             updated.location = {
//                 lat: driverLocation.latitude,
//                 lng: driverLocation.longitude,
//             }
//             updated.destinations = [restaurant.location.address, customer.location.address]
//             // updated.timeToArrive = ref.current.waypointDurations
//             updated.timeToArrive = ref.current.ETA
//         })).then(setDbCourier)
//     }
//
//     function clearLiveOrder() {
//         ref.current.liveOrder = null
//         setLiveOrder(null)
//         // ref.current.waypointDurations = []
//         // ref.current.ETA = []
//         // ref.current.distance = 0
//     }
//
//     const cancelOrder = async ({order}) => {
//         console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ cancelOrder ~~~~~~~~~~~~~~~~~~~~~ :")
//
//         DataStore.save(Order.copyOf(await DataStore.query(Order, order.id), (updated) => {
//             updated.courierID = "null"
//         })).then(() => clearLiveOrder())
//         DataStore.save(Courier.copyOf(await DataStore.query(Courier, dbCourier.id), updated => {
//             updated.destinations = []
//             updated.timeToArrive = []
//         })).then(setDbCourier)
//     }
//
//     const completeOrder = async ({order}) => {
//         console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ completeOrder ~~~~~~~~~~~~~~~~~~~~~ :")
//
//         DataStore.save(Order.copyOf(await DataStore.query(Order, order.id), (updated) => {
//             updated.status = "COMPLETED"
//         })).then(() => clearLiveOrder())
//         DataStore.save(Courier.copyOf(await DataStore.query(Courier, dbCourier.id), updated => {
//             updated.destinations = []
//             updated.timeToArrive = []
//         })).then(setDbCourier)
//     }
//
//     const clearCurrentORCD = () => {
//         setOrder(null)
//         setDishes([])
//         setCustomer(null)
//         setRestaurant(null)
//     }
//
//
//     return (
//         <OrderContext.Provider value={{
//             order,
//             dishes,
//             customer,
//             restaurant,
//             driverLocation,
//             ORCD,
//             activeORCD,
//             countOrderUpdates,
//
//             setOrder,
//             setDishes,
//             setCustomer,
//             setRestaurant,
//
//             cancelOrder,
//             assignToCourier,
//             completeOrder,
//             clearCurrentORCD,
//
//
//             activeOrdersUpdates,
//             liveOrder,
//             ref
//         }}>
//             {children}
//         </OrderContext.Provider>
//     )
// }
//
// export default OrderContextProvider;
//
// export const useOrderContext = () => useContext(OrderContext)
