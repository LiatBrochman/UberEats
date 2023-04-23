import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import {useEffect, useState} from "react";
import {useRestaurantContext} from "../../contexts/RestaurantContext";
import {Entypo} from "@expo/vector-icons";
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {useCourierContext} from "../../contexts/CourierContext";
import {Icon} from "@react-native-material/core";
import * as PropTypes from "prop-types";
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet'
import {useNavigation} from "@react-navigation/native";
import {startWatchingLocation} from "../../myExternalLibrary/LocationFunctions";
import {useOrderContext} from "../../contexts/OrderContext";
import MapBottomSheet from "../../components/MapBottomSheet";

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
    const {width, height} = useWindowDimensions()
    const {restaurants, setRestaurant} = useRestaurantContext({restaurants:[]})
    const {liveOrders} = useOrderContext({liveOrders: []})
    const {couriers} = useCourierContext({couriers:[]})
    const [customerLocation, setCustomerLocation] = useState(null)
    const navigation = useNavigation()
    const onCalloutPress = (restaurant) => {
        setRestaurant(restaurant)
        navigation.navigate("Restaurant")
    }


    useEffect(() => {

        startWatchingLocation(setCustomerLocation).then(sub => subscription.watchPosition = sub)

        // return subscription?.watchPosition?.remove()
    }, [])


    return (<GestureHandlerRootView style={styles.container}>
                <MapView
                    style={{...StyleSheet.absoluteFillObject, height: height * 0.95, width}}
                    provider={PROVIDER_GOOGLE}
                    followUserLocation={true}
                    showsUserLocation={true}
                    showsCompass={true}
                    pitchEnabled={true}
                    scrollEnabled={true}
                    initialRegion={{
                        latitude:
                            customerLocation?.latitude || 32.1975652,
                        longitude:
                            customerLocation?.longitude || 34.8775085,

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
                    showsMyLocationButton={true}
                    zoomControlEnabled={true}
                >
                    {restaurants.length > 0 && restaurants.map(restaurant => {
                            let color = "#FFAD60"

                            if (liveOrders.length > 0) {
                                color = "grey"
                                if (liveOrders.find(o => o.restaurantID === restaurant.id)) {
                                    color = "#FFAD60"
                                }
                            }
                            return <Marker
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
                                    borderColor: color
                                }}>
                                    {<Entypo name="shop" size={24} color={color}/>}
                                </View>
                            </Marker>
                        }
                    )}

                    {couriers.length > 0 && couriers.map(courier => {

                        if (!couriers.some(c => c.id === courier.id)) {
                            // Skip rendering the marker if the courier is not present in the `couriers` array
                            return null
                        }
                            return <Marker
                                key={courier.id+' '+liveOrders.length}
                                title={courier.name}
                                description={courier.transportationMode}
                                coordinate={{
                                    latitude: courier.location.lat,
                                    longitude: courier.location.lng
                                }}>
                                <View style={{padding: 5, borderRadius: 20}}>
                                    {courier.transportationMode === "DRIVING" &&
                                    <View style={{
                                        backgroundColor: 'white',
                                        padding: 3,
                                        borderRadius: 20,
                                        borderWidth: 2,
                                        borderColor: '#96CEB4'
                                    }}>
                                        <Icon name="car" size={30} color="#96CEB4"/>
                                    </View>}

                                    {courier.transportationMode === "BICYCLING" &&
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
                    )}
                </MapView>
                {liveOrders.length > 0 && <MapBottomSheet/>}

            </GestureHandlerRootView>)
}
export default Map


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

})

// Courier({
//     orderOfDestinations:['Pancakes Oldies', 'Pizza Nostalgia', 'AM-PM', 'yossi'],
//     timeToArrive:[20,15,7,18]
// })
// Courier({
//     orderOfDestinations:['Pancakes Oldies', 'yossi'],
//     timeToArrive:[30,12]
// })
