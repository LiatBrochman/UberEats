import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import styles from "./styles";
import {FontAwesome5, Fontisto, Ionicons} from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import {useOrderContext} from "../../contexts/OrderContext";
import {useDirectionContext} from "../../contexts/DirectionContext";
import {useCourierContext} from "../../contexts/CourierContext";
import {arrived} from "../../myExternalLibrary/LocationFunctions";

export const BottomSheetMapDirection = () => {

    const {assignToCourier, completeOrder} = useCourierContext()
    const {liveOrder, setLiveOrder, pressedOrder, clearPressedOrder, pressedState}
        = useOrderContext({pressedState: {order: null, restaurant: null, customer: null, dishes: []}})
    const {
        ETA_toRestaurant,
        ETA_toCustomer,
        distance,
        mapRef,
        origin,
        destination,
        clearDirections
    } = useDirectionContext()
    const [currentOrder, setCurrentOrder] = useState(liveOrder ?? pressedOrder)
    const bottomSheetRef = useRef(null)
    const snapPoints = useMemo(() => ["12%", "95%"], [])

    useEffect(() => {
        liveOrder && setCurrentOrder(liveOrder)
    }, [liveOrder])

    // const restaurant = DataStore.query(Restaurant, currentOrder.restaurantID).then()
    // const customer =  DataStore.query(Customer, currentOrder.customerID).then()
    // const dishes = DataStore.query(Dish, d => d.and(d => [d.orderID.eq(currentOrder.id)])).then()

    const onButtonPressed = () => {

        switch (currentOrder.status) {

            case "ACCEPTED":
            case "COOKING":
            case "READY_FOR_PICKUP":
                bottomSheetRef.current?.collapse()
                mapRef.current.animateToRegion({
                    latitude: origin.latitude,
                    longitude: origin.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                })
                assignToCourier({order: currentOrder, ETA: [ETA_toRestaurant, ETA_toCustomer]})
                break;


            case "PICKED_UP":

                if (liveOrder) {
                    console.log("\n\n xxxxx about to completeOrder  xxxxxx")

                    completeOrder(liveOrder.id).then(result => {
                        if (result === "finished") {
                            setLiveOrder(null)
                            clearPressedOrder()
                            clearDirections()
                        }
                    })
                    bottomSheetRef.current?.collapse()
                }
                break;


            default:
                console.warn(" wrong order status", currentOrder.status)
        }

    }
    const renderButtonTitle = () => {
        switch (currentOrder.status) {

            case "READY_FOR_PICKUP":
            case "COOKING":
            case "ACCEPTED":
                return 'Accept Order'

            case "PICKED_UP":
                return 'Complete Delivery'
        }

    }
    const isButtonDisabled = () => {
        /**
         button is clickable only when :
         -an order is waiting for courier to take it
         -the courier is at the door of the customer (for completing the order)
         */
        let isClickable = false
        switch (currentOrder.status) {
            case "ACCEPTED":
            case "COOKING":
            case "READY_FOR_PICKUP":

                /**
                 * when we see a new order waiting for courier to take it (the courier needs to click 'assign to order')
                 *
                 * !only 1 live order is allowed during this scenario
                 */
                if (!liveOrder && currentOrder.courierID === "null") {
                    isClickable = true
                } else {
                    //  currentOrder.courierID !== "null" && console.log("\n\n cannot be pressed because : order.courierID !== 'null' which means , it was taken by some1 else")
                    // liveOrder && console.log("\n\n cannot be pressed because : liveOrder already exists, you cannot have more than 1 live order at once")

                    isClickable = false
                }

                break;

            /**
             * to complete an order, the courier must be near the customer's address (100meters)
             */
            case "PICKED_UP":
                /**
                 * when the order is about to be finished (the courier needs to click 'order completed')
                 */

                if (liveOrder && arrived(origin, destination, 0.1)) {
                    isClickable = true
                } else {

                }

                break;


            case "NEW":
            case "COMPLETED":
            case "DECLINED":
                isClickable = false
                break;

            default:
                console.error("wrong status", currentOrder.status)

        }

        return !isClickable
        // return (status === "ACCEPTED" || status === "COOKING" || status === "READY_FOR_PICKUP" || order.courierID!=="null")
    }

    if (pressedState.dishes.length)
        return (
            <BottomSheet isVisible={true} ref={bottomSheetRef} snapPoints={snapPoints}
                         handleIndicatorStyle={styles.handleIndicator}>
                <View>
                    <Ionicons
                        onPress={() => {
                            !liveOrder && clearPressedOrder()
                        }}
                        name="arrow-back-circle"
                        size={45}
                        color="black"
                        style={{top: 40, left: 15, position: 'absolute'}}
                    />
                    <View style={styles.handleIndicatorContainer}>
                        <Text
                            style={styles.routeDetailsText}>{(ETA_toCustomer + ETA_toRestaurant).toFixed(0)} min</Text>
                        <FontAwesome5 name="shopping-bag" size={28} color="#96CEB4" style={{marginHorizontal: 10}}/>
                        <Text style={styles.routeDetailsText}>{distance?.toFixed(2)} km</Text>
                    </View>
                    <View style={styles.deliveryDetailsContainer}>
                        <Text style={styles.restaurantName}>{pressedState.restaurant.name}</Text>
                        <View style={styles.addressContainer}>
                            <Fontisto name="shopping-store" size={18} color="#D9534F"/>
                            <Text style={styles.addressText}>{currentOrder.restaurantLocation.address}</Text>
                        </View>
                        <View style={styles.addressContainer}>
                            <FontAwesome5 name="map-marker-alt" size={26} color="#D9534F"/>
                            <Text style={styles.addressText}>{currentOrder.customerLocation.address}</Text>
                        </View>

                        <View style={styles.orderDetailsContainer}>
                            {pressedState.dishes.map(dish =>
                                <Text style={styles.orderItemText}
                                      key={dish.id}>{dish.name} x{dish.quantity}</Text>
                            )}
                        </View>
                    </View>
                    <Pressable
                        style={{
                            ...styles.buttonContainer,
                            backgroundColor: isButtonDisabled() ? 'lightgrey' : '#FFAD60'
                        }}
                        onPress={onButtonPressed} disabled={isButtonDisabled()}>
                        <Text style={styles.buttonText}>{renderButtonTitle()}</Text>
                    </Pressable>
                </View>
            </BottomSheet>
        )
};

