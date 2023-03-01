import {useMemo, useRef} from "react";
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import OrderItem from '../../components/OrderItem';
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import {Entypo, Ionicons} from "@expo/vector-icons";
import {useOrderContext} from "../../contexts/OrderContext";
import {useNavigation} from "@react-navigation/native";
import MapViewDirections from "react-native-maps-directions";
import {useAuthContext} from "../../contexts/AuthContext";
import {GOOGLE_API_KEY} from '@env';


export var subscription = {}

const OrdersScreen = () => {
    const navigation = useNavigation()
    const {dbCourier} = useAuthContext()
    const {driverLocation, ORCD, activeORCD, ref} = useOrderContext()
    const bottomSheetRef = useRef({})
    const {width, height} = useWindowDimensions()
    const snapPoints = useMemo(() => ["12%", "95%"], [])


    // const getDestination = () => {
    //     /**
    //      *THE TRICK HERE is to combine way points!
    //      ACCEPTED \COOKING \READY_FOR_PICKUP = way point to restaurant , then to customer
    //      PICKED_UP = no way points , just customer
    //      */
    //     switch (ref.current.liveOrder.status) {
    //         case "ACCEPTED":
    //         case "COOKING" :
    //         case "READY_FOR_PICKUP":
    //         case "PICKED_UP":
    //             return {
    //                 latitude: ref.current.liveOrder.customerLocation.location.lat,
    //                 longitude: ref.current.liveOrder.customerLocation.location.lng
    //             }
    //         /**
    //          NOTE THE WAY POINTS!!!
    //          */
    //         default:
    //             return null
    //     }
    // }
    // const getWaypoints = () => {
    //     switch (ref.current.liveOrder.status) {
    //         case "ACCEPTED":
    //         case "COOKING":
    //         case "READY_FOR_PICKUP":
    //             return [{
    //                 latitude: ref.current.liveOrder.restaurantLocation.location.lat,
    //                 longitude: ref.current.liveOrder.restaurantLocation.location.lng
    //             }]
    //         case "PICKED_UP":
    //             return []
    //         default:
    //             return []
    //     }
    // }

    return (

        <GestureHandlerRootView style={styles.container}>

            <MapView
                style={{...StyleSheet.absoluteFillObject, height: height * 0.95, width}}
                provider={PROVIDER_GOOGLE}
                followUserLocation={true}
                showsUserLocation={true}
                showsMyLocationButton={true}
                showsCompass={true}
                pitchEnabled={true}
                scrollEnabled={true}
                zoomControlEnabled={true}
                initialRegion={{
                    latitude: driverLocation?.latitude || 32.1722383,
                    longitude: driverLocation?.longitude || 34.869715,
                    latitudeDelta: 0.12,
                    longitudeDelta: 0.12
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

                {ref.current.liveOrder && <MapViewDirections
                    mode={dbCourier.transportationMode}
                    origin={driverLocation}
                    waypoints={[{
                        latitude: ref.current.liveOrder.restaurantLocation.lat,
                        longitude: ref.current.liveOrder.restaurantLocation.lng
                    }]}
                    destination={{
                        latitude: ref.current.liveOrder.customerLocation.lat,
                        longitude: ref.current.liveOrder.customerLocation.lng
                    }}
                    strokeWidth={0}
                    strokeColor="rgba(0,0,0,0)"
                    apikey={GOOGLE_API_KEY}
                    onReady={(result) => {
                        ref.current.distance = result.distance
                        ref.current.waypointDurations = result?.legs.map(leg => parseInt(leg.duration.text.replace(/\s.*$/, "")))
                    }}
                />}

                {activeORCD && ORCD?.[0]?.restaurant?.id &&
                ORCD.map(({restaurant}, index) =>
                    <Marker
                        key={index}
                        title={restaurant.name}
                        description={restaurant.location.address}
                        coordinate={{
                            latitude: restaurant.location.lat,
                            longitude: restaurant.location.lng
                        }}>
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
            </MapView>
            <Ionicons
                onPress={() => navigation.navigate('Profile')}
                name="arrow-back-circle"
                size={45}
                color="black"
                style={{top: 40, left: 15, position: 'absolute'}}
            />
            {ORCD?.[0]?.restaurant?.id &&
            <BottomSheet isVisible={true} ref={bottomSheetRef} snapPoints={snapPoints}>
                <View style={{alignItems: 'center', marginBottom: 30}}>
                    <Text style={{
                        fontSize: 20, fontWeight: '600', letterSpacing: 0.5, paddingBottom: 5
                    }}>You're Online</Text>
                    <Text style={{letterSpacing: 0.5, color: '#D9534F', fontWeight: '600'}}>
                        Available Orders: {activeORCD.length}
                    </Text>

                </View>
                <BottomSheetFlatList
                    data={activeORCD}
                    renderItem={({item}) =>
                        <OrderItem
                            order={item.order}
                            restaurant={item.restaurant}
                            customer={item.customer}
                            dishes={item.dishes}
                        />}
                />
            </BottomSheet>
            }

        </GestureHandlerRootView>


    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

})

export default OrdersScreen;
