import {useMemo, useRef, useEffect, useState} from "react";
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import BottomSheet, {BottomSheetFlatList} from "@gorhom/bottom-sheet";
import {ActivityIndicator, Text, useWindowDimensions, View, Pressable} from "react-native";
import {FontAwesome5, Fontisto} from '@expo/vector-icons';
import styles from "./styles";
import MapView, {Marker} from "react-native-maps";
import * as Location from "expo-location";
import {Entypo, MaterialIcons, Ionicons} from "@expo/vector-icons";
 import MapViewDirective from "react-native-maps-directions";
import MapViewDirections from "react-native-maps-directions";
import {useNavigation, useRoute} from "@react-navigation/native";
import {GOOGLE_API_KEY} from '@env';
import {DataStore} from 'aws-amplify';
import {Dish, Order, OrderDish, OrderStatus as ORDER_STATUSES, Restaurant, User} from '../../models';
import {useOrderContext} from "../../contexts/OrderContext";


// const ORDER_STATUSES = {
//     READY_FOR_PICKUP: "READY_FOR_PICKUP",
//     ACCEPTED: "ACCEPTED",
//     PICKED_UP: "PICKED_UP",
// }

const OrdersDelivery = () => {
    const {order, user, orderDishes, restaurant, acceptOrder , fetchOrder, fetchUser, completeOrder, pickupOrder} = useOrderContext();
    // const [order, setOrder] = useState(null);
    // const [user, setUser] = useState(null);
    // const [restaurant, setRestaurant] = useState(null);
    // const [orderDishes, setOrderDishes] = useState([]);
    const [dishes, setDishes] = useState([]);

    const [driverLocation, setDriverLocation] = useState(null)
    const [totalMinutes, setTotalMinutes] = useState(0)
    const [totalKm, setTotalKm] = useState(0)
    // const [deliveryStatus, setDeliveryStatus] = useState(ORDER_STATUSES.READY_FOR_PICKUP)

    const [isDriverClose, setIsDriverClose] = useState(false)



    const bottomSheetRef = useRef(null);
    const mapRef = useRef(null)
    const {width, height} = useWindowDimensions();

    const snapPoints = useMemo(() => ["12%", "95%"], [])
    const navigation = useNavigation();
    const route = useRoute();
   const id = route.params?.id;

    useEffect(() => {
        // if (id) {
        //     DataStore.query(Order, id).then(setOrder)
        // }
        fetchOrder(id);
    }, [id])
    //
    useEffect(() => {
    //     if (order) {
    //         DataStore.query(User, order.userID).then(setUser)
    //         DataStore.query(Restaurant, order.orderRestaurantId).then(setRestaurant)
    //         DataStore.query(OrderDish, od => od.orderID.eq(order.id)).then(setOrderDishes)
    //     }
        fetchUser(order)
    }, [order])


    useEffect(() => {
        if (orderDishes) {
            (()=>{
                orderDishes.forEach( async orderDish=>{
                    const [dish] = await DataStore.query(Dish,dish=> dish.id.eq(orderDish.orderDishDishId))
                    setDishes(old=>[...old,dish])
                })
            })()
        }
    }, [orderDishes])

    useEffect(() => {

        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Nonono");
                return;
            }

            let location = await Location.getCurrentPositionAsync();
            setDriverLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        })();

         const foregroundSubscription =
            Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                distanceInterval: 100,
            },
            (updatedLocation) => {
                setDriverLocation({
                    latitude: updatedLocation.coords.latitude,
                    longitude: updatedLocation.coords.longitude,
                });
            }
        );

        // return foregroundSubscription;
    }, []);


    const onButtonPressed = async () => {
            if (order.status === "READY_FOR_PICKUP") {
            bottomSheetRef.current?.collapse();
            mapRef.current.animateToRegion({
                latitude: driverLocation.latitude,
                longitude: driverLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            });
            acceptOrder();
        }
            if (order.status ==="ACCEPTED") {
            bottomSheetRef.current?.collapse();
            pickupOrder();

        }
            if (order.status === "PICKED_UP") {
                await completeOrder();
            bottomSheetRef.current?.collapse();
           navigation.goBack()

        }
    };

    const renderButtonTitle = () => {
        if (order.status === "READY_FOR_PICKUP") {
            return 'Accept Order'
        }
        if (order.status === "ACCEPTED") {
            return 'Pick-Up Order'
        }
        if (order.status === "PICKED_UP") {
            return 'Complete Delivery'
        }
    }

    const isButtonDisabled = () => {
        if (order.status === "READY_FOR_PICKUP") {
            return false;
        }
        if (order.status === "ACCEPTED" && isDriverClose) {
            return false;
        }
        if (order.status === "PICKED_UP" && isDriverClose) {
            return false;
        }
        return true;
    }
    const restaurantLocation = {latitude: restaurant?.lat, longitude: restaurant?.lng}
    const deliveryLocation = {latitude: user?.lat, longitude: user?.lng}

    if (!order || !driverLocation || !restaurant || !user || !orderDishes) {
        return <ActivityIndicator size={"large"} color="gray"/>;
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <MapView
                ref={mapRef}
                style={{width, height}}
                showsUserLocation
                followUserLocation
                intitalRegion={{
                    latitude: driverLocation.latitude,
                    longitude: driverLocation.longitude,
                    latitudeDelta: 0.07,
                    longitudeDelta: 0.07
                }}
            >
                <MapViewDirections
                    origin={driverLocation}
                    destination={order.status === "ACCEPTED" ? restaurantLocation : deliveryLocation}
                    strokeWidth={10}
                    waypoints={order.status === "READY_FOR_PICKUP" ? [restaurantLocation] : []}
                    strokeColor="#3FC060"
                    apikey={GOOGLE_API_KEY}
                    onReady={(result) => {
                        setIsDriverClose(result.distance <= 0.1);
                        setTotalMinutes(result.duration)
                        setTotalKm(result.distance)
                    }}
                />
                <Marker
                    coordinate={{latitude: restaurant?.lat, longitude: restaurant?.lng}}
                    title={restaurant?.name}
                    description={restaurant?.address}
                >
                    <View style={{backgroundColor: 'green', padding: 5, borderRadius: 20}}>
                        <Entypo name="shop" size={30} color="white"/>
                    </View>
                </Marker>
                <Marker
                    coordinate={deliveryLocation}
                    title={user?.name}
                    description={user?.address}
                >
                    <View style={{backgroundColor: 'green', padding: 5, borderRadius: 20}}>
                        <MaterialIcons name="restaurant" size={30} color="white"/>
                    </View>
                </Marker>
            </MapView>
            {order.status === "READY_FOR_PICKUP" && (
                <Ionicons
                    onPress={() => navigation.goBack()}
                    name="arrow-back-circle"
                    size={45}
                    color="black"
                    style={{top: 40, left: 15, position: 'absolute'}}
                />
            )}
            <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}
                         handleIndicatorStyle={styles.handleIndicator}>
                <View style={styles.handleIndicatorContainer}>
                    <Text style={styles.routeDetailsText}>{totalMinutes.toFixed(0)} min</Text>
                    <FontAwesome5 name="shopping-bag" size={30} color="#3FC060" style={{marginHorizontal: 10}}/>
                    <Text style={styles.routeDetailsText}>{totalKm.toFixed(2)} km</Text>
                </View>
                <View style={styles.deliveryDetailsContainer}>
                    <Text style={styles.restaurantName}>{restaurant?.name}</Text>
                    <View style={styles.addressContainer}>
                        <Fontisto name="shopping-store" size={22} color="grey"/>
                        <Text style={styles.addressText}>{restaurant?.address}</Text>
                    </View>
                    <View style={styles.addressContainer}>
                        <FontAwesome5 name="map-marker-alt" size={30} color="grey"/>
                        <Text style={styles.addressText}>{user?.address}</Text>
                    </View>

                    <View style={styles.orderDetailsContainer}>
                        {orderDishes?.map(orderDish => {
                            const dish = dishes?.find(d => d.id === orderDish.orderDishDishId)
                            return <Text style={styles.orderItemText}
                                         key={orderDish.id}>{dish?.name} x{orderDish.quantity}</Text>
                        })}
                    </View>
                </View>
                <Pressable style={{...styles.buttonContainer, backgroundColor: isButtonDisabled() ? 'grey' : '#3FC060'}}
                           onPress={onButtonPressed} disabled={isButtonDisabled()}>
                    <Text style={styles.buttonText}>{renderButtonTitle()}</Text>

                </Pressable>
            </BottomSheet>
        </GestureHandlerRootView>
    );
};

export default OrdersDelivery;
