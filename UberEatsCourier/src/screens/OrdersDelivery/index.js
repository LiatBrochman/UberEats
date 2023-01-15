import {useMemo, useRef, useEffect, useState} from "react";
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import BottomSheet from "@gorhom/bottom-sheet";
import {ActivityIndicator, Text, useWindowDimensions, View, Pressable} from "react-native";
import {FontAwesome5, Fontisto} from '@expo/vector-icons';
import styles from "./styles";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import * as Location from "expo-location";
import {Entypo, MaterialIcons, Ionicons} from "@expo/vector-icons";
import MapViewDirections from "react-native-maps-directions";
import {useNavigation, useRoute} from "@react-navigation/native";
import {GOOGLE_API_KEY} from '@env';
import {useOrderContext} from "../../contexts/OrderContext";


const OrdersDelivery = () => {
    const {
        order,
        customer,
        restaurant,
        acceptOrder,
        fetchOrder,
        fetchCustomer,
        completeOrder,
        pickupOrder
    } = useOrderContext();
    const [dishes, setDishes] = useState([]);

    const [driverLocation, setDriverLocation] = useState(null)
    const [totalMinutes, setTotalMinutes] = useState(0)
    const [totalKm, setTotalKm] = useState(0)

    const [isDriverClose, setIsDriverClose] = useState(false)


    const bottomSheetRef = useRef(null)
    const mapRef = useRef(null)
    const {width, height} = useWindowDimensions()

    const snapPoints = useMemo(() => ["12%", "95%"], [])
    const navigation = useNavigation()
    const route = useRoute()
    const id = route.params?.id


    useEffect(() => {
        fetchOrder(id)
    }, [id])
    //
    useEffect(() => {
        fetchCustomer(order)
    }, [order])


    // useEffect(() => {
    //     if (dishes) {
    //             dishes.forEach( async dish=>{
    //                 const [dish] = await DataStore.query(Dish,dish=> dish.id.eq(dish.dishID))
    //                 setDishes(old=>[...old,dish])
    //             })
    //     }
    // }, [dishes])

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Nonono");
                return;
            }

            let location = await Location.getCurrentPositionAsync();
            setDriverLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        })()

        const foregroundSubscription = Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                distanceInterval: 100,
            },
            ({coords}) => {
                setDriverLocation({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                });
            }
        );
        // return foregroundSubscription;
    }, []);
//     useEffect(() => {
//
//         (async () => {
//             let {status} = await Location.requestForegroundPermissionsAsync();
//             if (status !== "granted") {
//                 console.log("Nonono");
//                 return;
//             }
//
//             let location = await Location.getCurrentPositionAsync();
//             setDriverLocation({
//                 latitude: location.coords.latitude,
//                 longitude: location.coords.longitude,
//             });
//         })()
//
//     const foregroundSubscription =
//         Location.watchPositionAsync(
//             {
//                 accuracy: Location.Accuracy.High,
//                 distanceInterval: 100,
//             },
//             (updatedLocation) => {
//                 setDriverLocation({
//                     latitude: updatedLocation.coords.latitude,
//                     longitude: updatedLocation.coords.longitude,
//                 });
//             });
//     return foregroundSubscription;
// },[]


    const onButtonPressed = async () => {
            if (order.status === "READY_FOR_PICKUP") {
            bottomSheetRef.current?.collapse();
            mapRef.current.animateToRegion({
                latitude: driverLocation.latitude,
                longitude: driverLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            })
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
    const restaurantLocation = {latitude: restaurant?.location.lat, longitude: restaurant?.location.lng}
    const deliveryLocation = {latitude: customer?.location.lat, longitude: customer?.location.lng}

    if (!order || !driverLocation || !restaurant || !customer ) {
        return <ActivityIndicator size={"large"} color="gray"/>;
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <MapView
                ref={mapRef}
                style={{width, height}}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                followUserLocation={true}
                initialRegion={{
                    latitude: driverLocation.latitude,
                    longitude: driverLocation.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.015
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
                    coordinate={{latitude: restaurant?.location.lat, longitude: restaurant?.location.lng}}
                    title={restaurant?.name}
                    description={restaurant?.location?.address}
                >
                    <View style={{backgroundColor: 'green', padding: 5, borderRadius: 20}}>
                        <Entypo name="shop" size={30} color="white"/>
                    </View>
                </Marker>
                <Marker
                    coordinate={deliveryLocation}
                    title={customer?.name}
                    description={customer?.location?.address}
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
                        <Text style={styles.addressText}>{restaurant?.location?.address}</Text>
                    </View>
                    <View style={styles.addressContainer}>
                        <FontAwesome5 name="map-marker-alt" size={30} color="grey"/>
                        <Text style={styles.addressText}>{customer?.location?.address}</Text>
                    </View>

                    <View style={styles.orderDetailsContainer}>
                        {dishes?.map(dish => {
                            // dishes?.find(d => d.id === dish.orderID)
                            return <Text style={styles.orderItemText}
                                         key={dish.id}>{dish?.name} x{dish?.quantity}</Text>
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
