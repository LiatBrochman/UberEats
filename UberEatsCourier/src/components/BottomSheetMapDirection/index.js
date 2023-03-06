import React, {useMemo, useRef} from 'react';
import {Pressable, Text, View} from 'react-native';
import styles from "./styles";
import {FontAwesome5, Fontisto, Ionicons} from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import {useOrderContext} from "../../contexts/OrderContext";
import {useDirectionContext} from "../../contexts/DirectionContext";
import {useNavigation} from "@react-navigation/native";
import {useCourierContext} from "../../contexts/CourierContext";
import {DataStore} from "aws-amplify";
import {Customer, Dish, Restaurant} from "../../models";

export const BottomSheetMapDirection = () => {

    const navigation = useNavigation()
    const {assignToCourier} = useCourierContext()
    const { liveOrder, completeOrder, setLiveOrder} = useOrderContext()
    const {ETA_toRestaurant, ETA_toCustomer, distance, mapRef, origin} = useDirectionContext()

    const bottomSheetRef = useRef(null)
    const snapPoints = useMemo(() => ["12%", "95%"], [])

    if(!liveOrder) return

    const restaurant = liveOrder?.restaurant || DataStore.query(Restaurant, liveOrder?.restaurantID).then()
    const customer = liveOrder?.customer || DataStore.query(Customer, liveOrder?.customerID).then()
    const dishes = liveOrder?.dishes || DataStore.query(Dish, d => d.and(d => [d.orderID.eq(liveOrder?.id)])).then()

    const onButtonPressed = () => {

        switch (liveOrder.status) {

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
                assignToCourier({order: liveOrder, ETA: [ETA_toRestaurant, ETA_toCustomer]})
                break;


            case "PICKED_UP":

                if (distance <= 1
                ) {
                    completeOrder({order: liveOrder})
                    bottomSheetRef.current?.collapse()
                    navigation.goBack()
                }
                break;


            default:
                console.warn(" wrong order status", liveOrder.status)
        }

    }
    const renderButtonTitle = () => {
        switch (liveOrder.status) {

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
        switch (liveOrder?.status) {
            case "ACCEPTED":
            case "COOKING":
            case "READY_FOR_PICKUP":

                /**
                 * when we see a new order waiting for courier to take it (the courier needs to click 'assign to order')
                 *
                 * !only 1 live order is allowed during this scenario
                 */
                if (!liveOrder && liveOrder.courierID === "null") {
                    isClickable = true
                } else {

                    liveOrder.courierID === "null"
                        ? console.log("\n\n cannot be pressed because : order.courierID === 'null'")
                        : console.log("\n\n cannot be pressed because : liveOrder doesnt exists")


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

                if (liveOrder && distance <= 1) {
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
                console.error("wrong status", liveOrder.status)
        }

        return !isClickable
        // return (status === "ACCEPTED" || status === "COOKING" || status === "READY_FOR_PICKUP" || order.courierID!=="null")
    }


    return (
        <BottomSheet isVisible={true} ref={bottomSheetRef} snapPoints={snapPoints}
                     handleIndicatorStyle={styles.handleIndicator}>

            <View style={styles.handleIndicatorContainer}>

                <Ionicons
                    onPress={() => {
                        setLiveOrder(null)
                    }}
                    name="arrow-back-circle"
                    size={45}
                    color="black"
                    style={{top: 40, left: 15, position: 'absolute'}}
                />

                <Text style={styles.routeDetailsText}>{(ETA_toCustomer + ETA_toRestaurant).toFixed(0)} min</Text>
                <FontAwesome5 name="shopping-bag" size={28} color="#96CEB4" style={{marginHorizontal: 10}}/>
                <Text style={styles.routeDetailsText}>{distance?.toFixed(2)} km</Text>
            </View>
            <View style={styles.deliveryDetailsContainer}>
                <Text style={styles.restaurantName}>{restaurant?.name}</Text>
                <View style={styles.addressContainer}>
                    <Fontisto name="shopping-store" size={18} color="#D9534F"/>
                    <Text style={styles.addressText}>{restaurant?.location?.address}</Text>
                </View>
                <View style={styles.addressContainer}>
                    <FontAwesome5 name="map-marker-alt" size={26} color="#D9534F"/>
                    <Text style={styles.addressText}>{customer?.location?.address}</Text>
                </View>

                <View style={styles.orderDetailsContainer}>
                    {dishes?.length && dishes.map(dish =>
                        <Text style={styles.orderItemText}
                              key={dish.id}>{dish?.name} x{dish?.quantity}</Text>
                    )}
                </View>
            </View>
            <Pressable
                style={{...styles.buttonContainer, backgroundColor: isButtonDisabled() ? 'lightgrey' : '#FFAD60'}}
                onPress={onButtonPressed} disabled={isButtonDisabled()}>
                <Text style={styles.buttonText}>{renderButtonTitle()}</Text>
            </Pressable>
        </BottomSheet>
    )
};

