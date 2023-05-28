import React, {useEffect} from 'react';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import MapView, {PROVIDER_GOOGLE} from "react-native-maps";
import {StyleSheet, useWindowDimensions} from "react-native";
import {MyDirections_fixed} from "../../components/MyDirections";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import {useOrderContext} from "../../contexts/OrderContext";
import {BottomSheetOrdersList} from "../../components/BottomSheetOrdersList";
import {BottomSheetMapDirection} from "../../components/BottomSheetMapDirection";
import {useDirectionContext} from "../../contexts/DirectionContext";
import styles from "./styles";
import {FixedMarkers} from "../../components/Markers/FixedMarkers";
import * as Location from "expo-location";
import {startWatchingLocation} from "../../myExternalLibrary/LocationFunctions";

/**
 - This React Native code defines a MapViewScreen component that displays a map with directions and markers.

 - The screen includes a gesture handler root view that allows the user to interact with the map.

 - The component imports several modules and components from different libraries and uses the MapView component from react-native-maps library to display the map.

 - The map has several properties that determine its initial location, size, and level of detail.

 - The MapWithDirections and Markers components are used to display directions and markers on the map.

 - The Ionicons component is used to display an arrow-back-circle icon that, when clicked, clears the current order context and navigates to the Profile screen.

 - Finally, the BottomSheetOrdersList and BottomSheetMapDirection components are used to display different information based on whether there is a live order or not.

 - Overall, this code creates a screen that displays a map with directions and markers, and provides user interaction and navigation functionality.
 */


function MapViewScreen() {
    const {width, height} = useWindowDimensions()
    const navigation = useNavigation()
    const {liveOrder, pressedOrder, clearPressedOrder, ordersToCollect, } = useOrderContext({ordersToCollect: []})
    const {mapRef, origin , setOrigin , ETA_toCustomer, ETA_toRestaurant} = useDirectionContext()

    useEffect(()=>{
        Location.getCurrentPositionAsync().then(({coords: {latitude, longitude}}) => setOrigin({latitude, longitude}))
    },[])

    useEffect(() => {
        liveOrder && console.log("\n ~~~~~~~~~~~~~~~~~~~~~ liveOrder was found! ~~~~~~~~~~~~~~~~~~~~~ ", liveOrder.id)
    }, [liveOrder])

    useEffect(() => {
        pressedOrder && console.log("\n ~~~~~~~~~~~~~~~~~~~~~ pressed Order was found! ~~~~~~~~~~~~~~~~~~~~~ ")
    }, [pressedOrder])

    useEffect(() => {
        ordersToCollect.length > 0 && console.log("\n ~~~~~~~~~~~~~~~~~~~~~ Collectable Orders were found! ~~~~~~~~~~~~~~~~~~~~~ ")
    }, [ordersToCollect.length])

    useEffect(()=>{
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ [ ETA_toRestaurant=",ETA_toRestaurant,",ETA_toCustomer=",ETA_toCustomer,"] ~~~~~~~~~~~~~~~~~~~~~ :")

    },[ETA_toRestaurant,ETA_toCustomer])

    useEffect(() => {

        startWatchingLocation(setOrigin).then(sub => subscription.watchPosition = sub)

        // return subscription?.watchPosition?.remove()
    }, [])

    return (

        <GestureHandlerRootView style={styles.container}>

            <MapView
                style={{...StyleSheet.absoluteFillObject, height: height * 1.05, width}}
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                followUserLocation={true}
                showsUserLocation={true}
                showsMyLocationButton={true}
                showsCompass={true}
                pitchEnabled={true}
                scrollEnabled={true}
                zoomControlEnabled={true}
                initialRegion={{
                    latitude: origin?.latitude || 32.1722383,
                    longitude: origin?.longitude || 34.869715,
                    latitudeDelta: 0.12,
                    longitudeDelta: 0.12
                }}
                showsZoomControls={true}
                zoomControlOptions={{
                    position: 9,
                    style: {
                        height: 40,
                        width: 40,
                        top: height / 2 - 20,
                        right: 10,
                    },
                }}
            >
                {origin && <MyDirections_fixed/>}
                <FixedMarkers/>

            </MapView>
            <Ionicons
                onPress={() => {
                    !liveOrder && clearPressedOrder()
                    navigation.navigate("MainStack", {screen: "Profile"})
                }}
                name="arrow-back-circle"
                size={45}
                color="black"
                style={{top: 40, left: 15, position: 'absolute'}}
            />


            {origin && ((liveOrder || pressedOrder) ? <BottomSheetMapDirection/> : ordersToCollect.length > 0 &&
                <BottomSheetOrdersList/>)}

        </GestureHandlerRootView>


    )
}

export default MapViewScreen
