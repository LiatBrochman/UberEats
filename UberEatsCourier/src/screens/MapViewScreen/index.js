import React, {useEffect} from 'react';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import MapView, {PROVIDER_GOOGLE} from "react-native-maps";
import {StyleSheet, useWindowDimensions} from "react-native";
import MapWithDirections from "../../components/MapWithDirections";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import {useOrderContext} from "../../contexts/OrderContext";
import {BottomSheetOrdersList} from "../../components/BottomSheetOrdersList";
import {BottomSheetMapDirection} from "../../components/BottomSheetMapDirection";
import {useDirectionContext} from "../../contexts/DirectionContext";
import styles from "./styles";
import {FixedMarkers} from "../../components/Markers/FixedMarkers";

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
    const {liveOrder, pressedOrder, setPressedOrder} = useOrderContext()
    const {mapRef, origin} = useDirectionContext()

    useEffect(() => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ liveOrder ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(liveOrder, null, 4))

    }, [liveOrder])

    return (

        <GestureHandlerRootView style={styles.container}>

            <MapView
                style={{...StyleSheet.absoluteFillObject, height: height * 0.95, width}}
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
                <MapWithDirections/>
                <FixedMarkers/>

            </MapView>
            <Ionicons
                onPress={() => {
                    setPressedOrder(null)
                    navigation.navigate('Profile')
                }}
                name="arrow-back-circle"
                size={45}
                color="black"
                style={{top: 40, left: 15, position: 'absolute'}}
            />

            {(!liveOrder && !pressedOrder) ? <BottomSheetOrdersList/> : <BottomSheetMapDirection/>}

        </GestureHandlerRootView>


    )
}

export default MapViewScreen