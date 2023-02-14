import * as Location from "expo-location";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import {useEffect, useMemo, useRef, useState} from "react";
import {useRestaurantContext} from "../../contexts/RestaurantContext";
import {AntDesign, Entypo} from "@expo/vector-icons";
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {useCourierContext} from "../../contexts/CourierContext";
import {Icon} from "@react-native-material/core";
// import Svg, {Defs, LinearGradient, Path, Stop} from "react-native-svg";
import * as PropTypes from "prop-types";
// import OrderListItem from "../../components/OrderListItem";
import {useOrderContext} from "../../contexts/OrderContext";
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet'


// const {
//     path,
//     pathLength,
//     stroke,
//     strokeDashoffset,
//     remainingTime,
//     elapsedTime,
//     size,
//     strokeWidth,
// } = useCountdown({ isPlaying: true, duration: 7, colors: '#abc' })


BottomSheet.propTypes = {
    snapPoints: PropTypes.any,
    ref: PropTypes.any,
    children: PropTypes.node
};


BottomSheetFlatList.propTypes = {
    renderItem: PropTypes.func,
    data: PropTypes.any
};


const Map = () => {
    const navigation = useNavigation()
    const {width, height} = useWindowDimensions()
    const {restaurants, setRestaurant} = useRestaurantContext()
    const {liveStatus, onGoingOrder} = useOrderContext()
    const {courier, duration} = useCourierContext()
    const [customerLocation, setCustomerLocation] = useState(null)
    const bottomSheetRef = useRef({})
    const snapPoints = useMemo(() => ["12%", "95%"], [])
    const [counter, setCounter] = useState(0)



    useEffect(() => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ liveStatus ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(liveStatus,null,4))
        
        switch (liveStatus) {
            case "ACCEPTED":
                setCounter(1)
                break;
            case "COOKING":
                setCounter(2)
                break;
            case "PICKED_UP":
                setCounter(3)
                break;
        }
    }, [liveStatus])

    // const {path, pathLength, stroke, strokeDashoffset, remainingTime, elapsedTime, size, strokeWidth}
    //     = useCountdown({isPlaying: true, duration: duration*60 || 10000, colors: 'url(#your-unique-id)'})
    // const onCalloutPress = (restaurant) => {
    //     setRestaurant(restaurant)
    //     navigation.navigate("Restaurant")
    //
    // }

    useEffect(() => {

        startWatchingCustomerLocation().then(sub => subscription.watchPosition = sub)

        // return subscription?.watchPosition?.remove()
    }, [])


    // useEffect(() => {
    //     if (courier?.length > 0) {
    //         console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ courier ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(courier, null, 4))
    //     }
    // }, [courier])

    const startWatchingCustomerLocation = async () => {

        let {status} = await Location.requestForegroundPermissionsAsync()
        switch (status === "granted") {

            case true:
                return await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        distanceInterval: 100,
                    },
                    ({coords}) => {
                        setCustomerLocation({
                            latitude: coords?.latitude,
                            longitude: coords.longitude,
                        })
                    })


            case false:
                console.error('Permission to access location was denied, please try again')
                return await startWatchingCustomerLocation()

        }


    }

    return (
        <>
            {
                <GestureHandlerRootView style={{flex: 1, backgroundColor: 'lightblue'}}>
                    {/*<View style={{display:"flex"}}>*/}
                    <MapView
                        style={{height, width, flex: 3.5}}
                        provider={PROVIDER_GOOGLE}
                        followUserLocation={true}
                        showsUserLocation={true}
                        showsCompass={true}
                        pitchEnabled={true}
                        scrollEnabled={true}
                        initialRegion={{
                            latitude:
                            // 32.1975652,
                                customerLocation?.latitude || 32.1975652,
                            longitude:
                            // 34.8775085,
                                customerLocation?.longitude || 34.8775085,
                            latitudeDelta: 0.12,
                            longitudeDelta: 0.12
                        }}

                        showsMyLocationButton={true}
                        zoomControlEnabled={true}
                    >
                        {restaurants.length > 0 && restaurants.map(restaurant =>
                            <Marker
                                key={restaurant.id}
                                title={restaurant.name}
                                description={restaurant.location.address}
                                coordinate={{
                                    latitude: restaurant?.location?.lat,
                                    longitude: restaurant?.location?.lng
                                }}
                                onCalloutPress={() => onCalloutPress(restaurant)}
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
                        )}
                        {courier &&
                        <Marker
                            key={courier.id}
                            title={courier.name}
                            description={courier.transportationMode}
                            coordinate={{
                                latitude: courier?.location?.lat,
                                longitude: courier?.location?.lng
                            }}>
                            <View style={{padding: 5, borderRadius: 20}}>
                                {courier?.transportationMode === "DRIVING" &&
                                <View style={{
                                    backgroundColor: 'white',
                                    padding: 3,
                                    borderRadius: 20,
                                    borderWidth: 2,
                                    borderColor: '#96CEB4'
                                }}>
                                    <Icon name="car" size={30} color="#96CEB4"/>
                                </View>}

                                {courier?.transportationMode === "BICYCLING" &&
                                <View style={{
                                    backgroundColor: 'white',
                                    padding: 3,
                                    borderRadius: 20,
                                    borderWidth: 2,
                                    borderColor: '#96CEB4'
                                }}><Icon name="bicycle" size={30} color="#96CEB4"/></View>}
                            </View>
                        </Marker>
                        }
                    </MapView>

                    {onGoingOrder &&
                    <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>

                        <View style={{marginLeft: 30, marginBottom: 30}}>
                            <Text style={{letterSpacing: 0.5, color: 'gray'}}>
                                DELIVERY TIME
                            </Text>
                            {duration && <View style={{flexDirection: "row", paddingTop: 10}}>
                                <AntDesign
                                    name="clockcircle"
                                    size={20}
                                    color={"gray"}
                                    style={{marginRight: 10, alignSelf: "center"}}
                                />
                                <Text style={{
                                    fontSize: 20, fontWeight: '600', letterSpacing: 0.5
                                }}>{duration} minutes</Text>
                            </View>}
                            <View style={{flexDirection: "row", paddingTop: 10}}>
                                <AntDesign
                                    name={counter >= 1 ? "checkcircle" : "minuscircle"}
                                    size={25}
                                    color={counter >= 1 ? "#96CEB4" : "#FFAD60"}
                                    style={{marginRight: 10, alignSelf: "center"}}
                                />
                                <View>
                                    <Text style={{letterSpacing: 0.5, fontWeight: '600'}}>
                                        Order confirmed
                                    </Text>
                                    <Text style={{letterSpacing: 0.5, color: 'gray'}}>
                                        Your order has been received
                                    </Text>

                                </View>

                            </View>
                            <View style={{
                                borderWidth: 0.5,
                                borderColor: 'lightgray',
                                marginTop: 10,
                                width: "90%"
                            }}></View>
                            <View style={{flexDirection: "row", paddingTop: 20}}>
                                <AntDesign
                                    name={counter >= 2 ? "checkcircle" : "minuscircle"}
                                    size={25}
                                    color={counter >= 2 ? "#96CEB4" : "#FFAD60"}
                                    style={{marginRight: 10, alignSelf: "center"}}
                                />
                                <View>
                                    <Text style={{letterSpacing: 0.5, fontWeight: '600'}}>
                                        Order prepared
                                    </Text>
                                    <Text style={{letterSpacing: 0.5, color: 'gray'}}>
                                        Your order has been prepared
                                    </Text>

                                </View>

                            </View>
                            <View style={{
                                borderWidth: 0.5,
                                borderColor: 'lightgray',
                                marginTop: 10,
                                width: "90%"
                            }}></View>
                            <View style={{flexDirection: "row", paddingTop: 20}}>
                                <AntDesign
                                    name={counter >= 3 ? "checkcircle" : "minuscircle"}
                                    size={25}
                                    color={counter >= 3 ? "#96CEB4" : "#FFAD60"}
                                    style={{marginRight: 10, alignSelf: "center"}}
                                />
                                <View>
                                    <Text style={{letterSpacing: 0.5, fontWeight: '600'}}>
                                        Delivery in progress
                                    </Text>
                                    <Text style={{letterSpacing: 0.5, color: 'gray'}}>
                                        Hang on! Your food is on the way.
                                    </Text>

                                </View>

                            </View>
                            <View style={{
                                borderWidth: 0.5,
                                borderColor: 'lightgray',
                                marginTop: 10,
                                width: "90%"
                            }}></View>
                        </View>

                    </BottomSheet>
                    }


                </GestureHandlerRootView>
            }
        </>

    )
}

export default Map
const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        // paddingTop: Constants.statusBarHeight,
        // paddingTop: 637,
        // backgroundColor: 'transparent',
        position: 'absolute',
        // paddingLeft: 120,
        top: "82%",
        left: "28%"
    },
    time: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
    }
})

// Courier({
//     orderOfDestinations:['Pancakes Oldies', 'Pizza Nostalgia', 'AM-PM', 'yossi'],
//     timeToArrive:[20,15,7,18]
// })
// Courier({
//     orderOfDestinations:['Pancakes Oldies', 'yossi'],
//     timeToArrive:[30,12]
// })
