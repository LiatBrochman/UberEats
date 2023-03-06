// import React, {useEffect, useState} from 'react';
// import {useOrderContext} from "../../contexts/OrderContext";
// import RestaurantMarker from "./RestaurantMarker";
// import CustomerMarker from "./CustomerMarker";
// import {DataStore} from "aws-amplify";
// import {Customer, Restaurant} from "../../models";
// import {View} from "react-native";
//
//
// function Markers() {
//
//     const {liveOrder, pressedOrder, ordersToCollect} = useOrderContext({ordersToCollect: []})
//     const [markers, setMarkers] = useState([])
//     // const [restaurant,setRestaurant] =useState(null)
//     // const [customer,setCustomer] = useState(null)
//     //
//     // useEffect(() => {
//     //     if (liveOrder || pressedOrder) {
//     //         const rest_id = liveOrder?.restaurantID || pressedOrder?.restaurantID
//     //         DataStore.query(Restaurant, rest_id).then(setRestaurant)
//     //         const cust_id = liveOrder?.customerID || pressedOrder?.customerID
//     //         DataStore.query(Customer, cust_id).then(setCustomer)
//     //     }
//     // },[liveOrder,pressedOrder])
//
//     useEffect(() => {
//
//         if (liveOrder ?? pressedOrder) {
//             console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ liveOrder ?? pressedOrder ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(liveOrder ?? pressedOrder, null, 4))
//
//             setMarkers(async () =>
//                 [
//                     <RestaurantMarker
//                         props={{
//                             order: liveOrder ?? pressedOrder,
//                             restaurant: await DataStore.query(Restaurant, liveOrder?.restaurantID ?? pressedOrder?.restaurantID)
//                         }}/>,
//
//                     <CustomerMarker props={{
//                         order: liveOrder ?? pressedOrder,
//                         customer: await DataStore.query(Customer, liveOrder?.customerID ?? pressedOrder?.customerID)
//                     }}/>
//                 ]
//             )
//
//         } else if (ordersToCollect.length > 0) {
//
//             setMarkers(
//                 ordersToCollect.map(async order =>
//                     <RestaurantMarker props={{
//                         order: order,
//                         restaurant: await DataStore.query(Restaurant, order.restaurantID)
//                     }}/>)
//             )
//         }
//
//
//     }, [liveOrder, pressedOrder])
//
//
//     return (markers)
//
// }
//
// export default Markers;
//
