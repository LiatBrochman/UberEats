// import {useMemo, useRef, useState} from "react";
// import {GestureHandlerRootView} from 'react-native-gesture-handler'
// import {ActivityIndicator, StyleSheet, useWindowDimensions} from "react-native";
// import {Ionicons} from '@expo/vector-icons';
// import styles from "./styles";
// import MapView, {PROVIDER_GOOGLE} from "react-native-maps";
// import {useNavigation} from "@react-navigation/native";
// import {useOrderContext} from "../../contexts/OrderContext";
// import {useAuthContext} from "../../contexts/AuthContext";
// import MapWithDirections from "../../components/MapWithDirections";
// import Markers from "../../components/Markers";
// import MyBottomSheet from "../../components/MyBottomSheet";
//
// const OrdersDelivery = () => {
//
//     const {width, height} = useWindowDimensions()
//     const {dbCourier} = useAuthContext()
//     const {
//         order,
//         customer,
//         restaurant,
//         assignToCourier,
//         driverLocation,
//         completeOrder,
//         dishes,
//         ref
//     } = useOrderContext()
//
//     function initTotalMinutes() {
//         return ref.current?.waypointDurations
//
//             ? ref.current.waypointDurations[0] + ref.current.waypointDurations[1]
//
//             : 0
//     }
//
//     function initTotalKm() {
//         return ref.current?.distance || 999
//     }
//
//     const [totalMinutes, setTotalMinutes] = useState(initTotalMinutes)
//     const [totalKm, setTotalKm] = useState(Number(initTotalKm))
//     const bottomSheetRef = useRef(null)
//     const mapRef = useRef(null)
//     const snapPoints = useMemo(() => ["12%", "95%"], [])
//     const navigation = useNavigation()
//     const onButtonPressed = async () => {
//
//         switch (order.status) {
//
//             case "ACCEPTED":
//             case "COOKING":
//             case "READY_FOR_PICKUP":
//                 bottomSheetRef.current?.collapse()
//                 mapRef.current.animateToRegion({
//                     latitude: driverLocation.latitude,
//                     longitude: driverLocation.longitude,
//                     latitudeDelta: 0.01,
//                     longitudeDelta: 0.01
//                 })
//                 await assignToCourier({order})
//                 break;
//
//
//             case "PICKED_UP":
//
//                 if (ref.current.distance <= 1
//                     // arrived(driverLocation, customer.location, 100)
//                 ) {
//                     await completeOrder({order})
//                     bottomSheetRef.current?.collapse()
//                     navigation.goBack()
//                 }
//                 break;
//
//
//             default:
//                 console.warn(" wrong order status", order.status)
//         }
//
//     }
//     const renderButtonTitle = () => {
//         switch (order.status) {
//
//             case "READY_FOR_PICKUP":
//             case "COOKING":
//             case "ACCEPTED":
//                 return 'Accept Order'
//             // return 'Pick-Up Order'
//             case "PICKED_UP":
//                 return 'Complete Delivery'
//         }
//
//     }
//     const isButtonDisabled = () => {
//         /**
//          button is clickable only when :
//          -an order is waiting for courier to take it
//          -the courier is at the door of the customer (for completing the order)
//          */
//         let isClickable = false
//         switch (order.status) {
// //ref.current.liveOrder.status
//             case "ACCEPTED":
//             case "COOKING":
//             case "READY_FOR_PICKUP":
//
//                 /**
//                  * when we see a new order waiting for courier to take it (the courier needs to click 'assign to order')
//                  *
//                  * !only 1 live order is allowed during this scenario
//                  */
//                 if (!ref.current.liveOrder && order.courierID === "null") {
//                     isClickable = true
//                 } else {
//                     isClickable = false
//                 }
//
//                 break;
//
//             /**
//              * to complete an order, the courier must be near the customer's address (100meters)
//              */
//             case "PICKED_UP":
//                 /**
//                  * when the order is about to be finished (the courier needs to click 'order completed')
//                  */
//                 //console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ ref.current.distance ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(ref.current.distance, null, 4))
//                 if (ref.current.liveOrder && ref.current.distance <= 1) {
//                     isClickable = true
//                 } else {
//
//                 }
//
//                 break;
//
//
//             case "NEW":
//             case "COMPLETED":
//             case "DECLINED":
//                 isClickable = false
//                 break;
//
//             default:
//                 console.error("wrong status", order.status)
//         }
//
//         return !isClickable
//         // return (status === "ACCEPTED" || status === "COOKING" || status === "READY_FOR_PICKUP" || order.courierID!=="null")
//     }
//
//
//     const getDestination = () => {
//         /**
//          *THE TRICK HERE is to combine way points!
//          ACCEPTED \COOKING \READY_FOR_PICKUP = way point to restaurant , then to customer
//          PICKED_UP = no way points , just customer
//          */
//         switch (order.status) {
//             case "ACCEPTED":
//             case "COOKING" :
//             case "READY_FOR_PICKUP":
//             case "PICKED_UP":
//                 return {
//                     latitude: order.customerLocation.lat,
//                     longitude: order.customerLocation.lng
//                 }
//             /**
//              NOTE THE WAY POINTS!!!
//              */
//             default:
//                 return null
//         }
//     }
//     const getWaypoints = () => {
//         switch (order.status) {
//             case "ACCEPTED":
//             case "COOKING":
//             case "READY_FOR_PICKUP":
//                 return [{
//                     latitude: order.restaurantLocation.lat,
//                     longitude: order.restaurantLocation.lng
//                 }]
//             case "PICKED_UP":
//                 return []
//             default:
//                 return []
//         }
//     }
//
//     if (!order || !driverLocation || !restaurant || !customer) {
//         return <ActivityIndicator size={"large"} color="gray"/>
//     }
//
//     return (
//         <GestureHandlerRootView style={styles.container}>
//             <MapView
//                 style={{...StyleSheet.absoluteFillObject, height: height * 0.95, width}}
//                 ref={mapRef}
//                 provider={PROVIDER_GOOGLE}
//                 showsUserLocation={true}
//                 followUserLocation={true}
//                 showsMyLocationButton={true}
//                 showsCompass={true}
//                 pitchEnabled={true}
//                 scrollEnabled={true}
//                 zoomControlEnabled={true}
//                 initialRegion={{
//                     latitude: driverLocation.latitude,
//                     longitude: driverLocation.longitude,
//                     latitudeDelta: 0.015,
//                     longitudeDelta: 0.015
//                 }}
//                 showsZoomControls={true}
//                 zoomControlOptions={{
//                     position: 9, // center-right position
//                     style: {
//                         height: 40,
//                         width: 40,
//                         top: height / 2 - 20,
//                         right: 10,
//                     },
//                 }}
//             >
//
//
//                 <MapWithDirections
//
//                     // <MapViewDirections
//                     // mode={dbCourier.transportationMode}
//                     // origin={driverLocation}
//                     // waypoints={ref.current.waypoints}
//                     // destination={ref.current.destination}
//                     // strokeWidth={10}
//                     // strokeColor="#96CEB4"
//                     // apikey={GOOGLE_API_KEY}
//                     // onReady={(result) => {
//                     //     setTotalMinutes(result.duration)
//                     //     setTotalKm(result.distance)
//                     //
//                     //
//                     //     ref.current.distance = result.distance
//                     //     const prevWaypointsDuration = ref.current.waypointDurations
//                     //     ref.current.waypointDurations = result?.legs.map(leg => parseInt(leg.duration.text.replace(/\s.*$/, "")))
//                     //     if(ref.current.waypointDurations!==ref.current.waypointDurations){
//                     //
//                     //     }
//                     // }}<MapViewDirections
//                     //                         mode={dbCourier.transportationMode}
//                     //                         origin={driverLocation}
//                     //                         waypoints={getWaypoints()}
//                     //                         destination={getDestination()}
//                     //                         strokeWidth={10}
//                     //                         strokeColor="#96CEB4"
//                     //                         apikey={GOOGLE_API_KEY}
//                     //                         onReady={(result) => {
//                     //                             setTotalMinutes(result.duration)
//                     //                             setTotalKm(result.distance)
//                     //                             ref.current.distance = result.distance
//                     //                             const prevETAs = ref.current.waypointDurations
//                     //                             ref.current.waypointDurations = result?.legs.map(leg => parseInt(leg.duration.text.replace(/\s.*$/, "")))
//                     //                             console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ prevETAs, ref.current.waypointDurations ~~~~~~~~~~~~~~~~~~~~~ :", prevETAs, ref.current.waypointDurations)
//                     //
//                     //                         }}
//                     //                     />
//                 />
//
//
//                 <Markers/>
//
//             </MapView>
//             <Ionicons
//                 onPress={() => navigation.goBack()}
//                 name="arrow-back-circle"
//                 size={45}
//                 color="black"
//                 style={{top: 40, left: 15, position: 'absolute'}}
//             />
//
//             <MyBottomSheet/>
//         </GestureHandlerRootView>
//     )
// }
//
//
// export default OrdersDelivery
