import {useEffect, useMemo, useRef, useState} from "react";
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import BottomSheet from "@gorhom/bottom-sheet";
import {ActivityIndicator, Pressable, StyleSheet, Text, useWindowDimensions, View} from "react-native";
import {Entypo, FontAwesome5, Fontisto, Ionicons, MaterialIcons} from '@expo/vector-icons';
import styles from "./styles";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import {useNavigation} from "@react-navigation/native";
import {GOOGLE_API_KEY} from '@env';
import {useOrderContext} from "../../contexts/OrderContext";
import {useAuthContext} from "../../contexts/AuthContext";


function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    const earthRadiusKm = 6371;

    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
}

function arrived(driverLocation, customerLocation, minDistance) {
    return (distanceInKmBetweenEarthCoordinates(driverLocation.latitude, driverLocation.longitude, customerLocation.lat, customerLocation.lng) / 1000) <= minDistance
}

const OrdersDelivery = () => {
    const {
        order,
        customer,
        restaurant,
        assignToCourier,
        driverLocation,
        completeOrder,
        dishes,
        setWaypointDurations
    } = useOrderContext()

    const {dbCourier} = useAuthContext()
    const [totalMinutes, setTotalMinutes] = useState(0)
    const [totalKm, setTotalKm] = useState(0)
    const distanceRef = useRef(null)
    const bottomSheetRef = useRef(null)
    const mapRef = useRef(null)
    const {width, height} = useWindowDimensions()

    const snapPoints = useMemo(() => ["12%", "95%"], [])
    const navigation = useNavigation()


    // const changeStatusToCompleted = ({id, newStatus}) => {
    //     DataStore.query(Order, id)
    //         .then(order => DataStore.save(
    //                 Order.copyOf(order, (updated) => {
    //                     updated.status = newStatus
    //                 })
    //             )
    //         )
    //     setStatus(newStatus)
    // }

    const onButtonPressed = async () => {


        switch (order.status) {

            case "ACCEPTED":
            case "COOKING":
            case "READY_FOR_PICKUP":
                bottomSheetRef.current?.collapse()
                mapRef.current.animateToRegion({
                    latitude: driverLocation.latitude,
                    longitude: driverLocation.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                })
                await assignToCourier({order})
                break;


            case "PICKED_UP":

                if (distanceRef.current <= 0.1
                    // arrived(driverLocation, customer.location, 100)
                ) {
                    await completeOrder({order})
                    bottomSheetRef.current?.collapse()
                    navigation.goBack()
                }
                break;


            default:
                console.warn(" wrong order status", order.status)
        }

    }
    const renderButtonTitle = () => {
        switch (order.status) {

            case "READY_FOR_PICKUP":
            case "COOKING":
            case "ACCEPTED":
                return 'Accept Order'
            // return 'Pick-Up Order'
            case "PICKED_UP":
                return 'Complete Delivery'
        }

    }

    const isButtonDisabled = () => {
        /**
         button is clickable only when status is :
         ACCEPTED\COOKING\READY_FOR_PICKUP
         and, when the order isn't assigned (yet) to the courier (or to any other courier)
         */
        let isClickable = false

        switch (order.status) {

            case "ACCEPTED":
            case "COOKING":
            case "READY_FOR_PICKUP":
                isClickable = order.courierID === "null"
                break;

            /**
             * to complete an order, the courier must be near the customer's address (100meters)
             */
            case "PICKED_UP":
                console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ distanceRef.current ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(distanceRef.current, null, 4))
                isClickable = distanceRef.current <= 0.1
                break;


            case "NEW":
            case "COMPLETED":
            case "DECLINED":
                isClickable = false
                break;

            default:
                console.error("wrong status", order.status)
        }

        return !isClickable
        // return (status === "ACCEPTED" || status === "COOKING" || status === "READY_FOR_PICKUP" || order.courierID!=="null")
    }
    const restaurantLocation = {latitude: restaurant?.location.lat, longitude: restaurant?.location.lng}
    const deliveryLocation = {latitude: customer?.location.lat, longitude: customer?.location.lng}

    if (!order || !driverLocation || !restaurant || !customer) {
        return <ActivityIndicator size={"large"} color="gray"/>
    }

    const getDestination = () => {
        /**
         *THE TRICK HERE is to combine way points!
         ACCEPTED \COOKING \READY_FOR_PICKUP = way point to restaurant , then to customer
         PICKED_UP = no way points , just customer
         */
        switch (order.status) {
            case "ACCEPTED":
            case "COOKING" :
            case "READY_FOR_PICKUP":
            case "PICKED_UP":
                return deliveryLocation
            /**
             NOTE THE WAY POINTS!!!
             */
            default:
                return null
        }
    }
    const getWaypoints = () => {
        switch (order.status) {
            case "ACCEPTED":
            case "COOKING":
            case "READY_FOR_PICKUP":
                return [restaurantLocation]
            case "PICKED_UP":
                return []
            default:
                return []
        }
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <MapView
                style={{ ...StyleSheet.absoluteFillObject, height: height *0.95, width }}
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                followUserLocation={true}
                showsMyLocationButton={true}
                showsCompass={true}
                pitchEnabled={true}
                scrollEnabled={true}
                zoomControlEnabled={true}
                initialRegion={{
                    latitude: driverLocation.latitude,
                    longitude: driverLocation.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.015
                }}
                showsZoomControls={true}
                zoomControlOptions={{
                    position: 9, // center-right position
                    style: {
                        height: 40,
                        width: 40,
                        top: height / 2 - 20,
                        right: 10,
                    },
                }}
            >
                <Marker coordinate={{ latitude: 32.1975652, longitude: 34.8775085 }} />
                <MapViewDirections
                    origin={driverLocation}
                    mode={dbCourier.transportationMode}
                    destination={getDestination()}
                    strokeWidth={10}
                    waypoints={getWaypoints()}
                    strokeColor="#96CEB4"
                    apikey={GOOGLE_API_KEY}
                    onReady={(result) => {
                        setTotalMinutes(result.duration)
                        setTotalKm(result.distance)
                        distanceRef.current = result.distance
                        setWaypointDurations(result?.legs.map(leg => parseInt(leg.duration.text.replace(/\s.*$/, ""))))
                    }}
                />
                <Marker
                    coordinate={{latitude: restaurant?.location.lat, longitude: restaurant?.location.lng}}
                    title={restaurant?.name}
                    description={restaurant?.location.address}
                >
                    <View style={{
                        backgroundColor: 'white',
                        padding: 5,
                        borderRadius: 20,
                        borderWidth: 2,
                        borderColor: '#FFAD60'
                    }}>
                        <Entypo name="shop" size={24} color="#FFAD60"/>
                    </View>
                </Marker>
                <Marker
                    coordinate={deliveryLocation}
                    title={customer?.name}
                    description={customer?.location.address}
                >
                    <View style={{
                        backgroundColor: 'white',
                        padding: 6,
                        borderRadius: 20,
                        borderWidth: 2,
                        borderColor: '#D9534F'
                    }}>
                        <MaterialIcons name="person" size={20} color="#D9534F"/>
                    </View>
                </Marker>
            </MapView>
            <Ionicons
                onPress={() => navigation.goBack()}
                name="arrow-back-circle"
                size={45}
                color="black"
                style={{top: 40, left: 15, position: 'absolute'}}
            />

            <BottomSheet isVisible={true} ref={bottomSheetRef} snapPoints={snapPoints}
                         handleIndicatorStyle={styles.handleIndicator}>
                <View style={styles.handleIndicatorContainer}>
                    <Text style={styles.routeDetailsText}>{totalMinutes.toFixed(0)} min</Text>
                    <FontAwesome5 name="shopping-bag" size={28} color="#96CEB4" style={{marginHorizontal: 10}}/>
                    <Text style={styles.routeDetailsText}>{totalKm.toFixed(2)} km</Text>
                </View>
                <View style={styles.deliveryDetailsContainer}>
                    <Text style={styles.restaurantName}>{restaurant?.name}</Text>
                    <View style={styles.addressContainer}>
                        <Fontisto name="shopping-store" size={18} color="#D9534F"/>
                        <Text style={styles.addressText}>{restaurant?.location.address}</Text>
                    </View>
                    <View style={styles.addressContainer}>
                        <FontAwesome5 name="map-marker-alt" size={26} color="#D9534F"/>
                        <Text style={styles.addressText}>{customer?.location.address}</Text>
                    </View>

                    <View style={styles.orderDetailsContainer}>
                        {dishes?.map(dish => {
                            return <Text style={styles.orderItemText}
                                         key={dish.id}>{dish?.name} x{dish?.quantity}</Text>
                        })}
                    </View>
                </View>
                <Pressable
                    style={{...styles.buttonContainer, backgroundColor: isButtonDisabled() ? 'lightgrey' : '#FFAD60'}}
                    onPress={onButtonPressed} disabled={isButtonDisabled()}>
                    <Text style={styles.buttonText}>{renderButtonTitle()}</Text>

                </Pressable>
                {/*{ order?.status === "PICKED_UP" &&*/}
                {/*<Button title="delivered"*/}
                {/*        onPress={() => changeStatusToCompleted({id: order.id, newStatus: "COMPLETED"})}*/}
                {/*/>}*/}
            </BottomSheet>
        </GestureHandlerRootView>
    )
}


export default OrdersDelivery
