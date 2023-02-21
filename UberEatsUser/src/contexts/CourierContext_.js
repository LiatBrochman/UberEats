// import {createContext, useContext, useEffect, useState} from "react";
// import {useOrderContext} from "./OrderContext";
// import {DataStore} from "aws-amplify";
// import {Courier} from "../models";
//
//
// const CourierContext = createContext({})
//
//
// const CourierContextProvider = ({children}) => {
//     const {orders, onGoingOrder} = useOrderContext()
//     const [courier, setCourier] = useState(null)
//     const [duration, setDuration] = useState(null)
//
//
//     useEffect(() => {
//         /**
//          * init courier + subscribe him
//          */
//         if (onGoingOrder ) {
//             subscription.courier = DataStore.observeQuery(Courier, c => c.id.eq(onGoingOrder.courierID))
//                 .subscribe(({items, isSynced}) => {
//                     if (isSynced && items?.[0]?.id === onGoingOrder?.courierID) {
//                             setCourier(items?.[0])
//                             const totalTime = items?.[0].timeToArrive.reduce((total, current) => total + current)
//                             setDuration(totalTime)
//                     }
//                 })
//         } else {
//             /**
//              * onGoingOrder has changed to null => we need to stop subscribing to it
//              */
//             setCourier(null)
//             setDuration(null)
//             subscription?.courier?.unsubscribe()
//         }
//
//     }, [onGoingOrder]);
//
//
//     // useEffect(() => {
//     //     if (orders) {
//     //         const orderWithCourier = orders?.length && orders.find(o => {
//     //             if (o?.courierID && o?.courierID !== "null") {
//     //                 return o?.courierID
//     //             }
//     //         })
//     //         if (orderWithCourier && orderWithCourier?.courierID) {
//     //
//     //             subscription.courier = DataStore.observeQuery(Courier, c => c.id.eq(orderWithCourier.courierID))
//     //                 .subscribe(({items, isSynced}) => {
//     //                   if  (isSynced){
//     //                       setCourier(items?.[0])
//     //                       const totalTime = items?.[0].timeToArrive.reduce((total,current)=>total+current)
//     //                       setDuration(totalTime)
//     //                   }
//     //                 })
//     //         }
//     //     }
//     //     // return subscription?.courier?.unsubscribe()
//     // }, [orders])
//
//     return (
//         <CourierContext.Provider value={{
//             courier,
//             duration
//         }}>
//             {children}
//         </CourierContext.Provider>
//     )
//
// }
//
// export default CourierContextProvider
//
// export const useCourierContext = () => useContext(CourierContext)
