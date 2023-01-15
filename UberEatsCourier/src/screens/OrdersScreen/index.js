import {useEffect, useMemo, useRef, useState} from "react";
import {Button, Text, useWindowDimensions, View} from 'react-native';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import OrderItem from '../../components/OrderItem';
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import {Entypo, Ionicons} from "@expo/vector-icons";
import {Amplify, Auth} from "aws-amplify";
import {useOrderContext} from "../../contexts/OrderContext";
import {useNavigation} from "@react-navigation/native";
import {useAuthContext} from "../../contexts/AuthContext";


export var subscription = {}

const OrdersScreen = () => {
    const navigation = useNavigation()
    const {dbCourier} = useAuthContext()
    const {driverLocation, ORCD} = useOrderContext()
    const bottomSheetRef = useRef({})
    const {width, height} = useWindowDimensions()
    const snapPoints = useMemo(() => ["12%", "95%"], [])

    const [orders,setOrders] = useState([])
    const [restaurants,setRestaurants] =useState([])

    useEffect(()=>{
        if(ORCD && ORCD?.length > 0 ){
            setOrders(ORCD.map(i => i.order))
            setRestaurants(ORCD.map(i => i.restaurant))
        }
    },[ORCD])

    return (
        <>
            {driverLocation?.latitude && ORCD?.[0]?.restaurant?.id &&
            <GestureHandlerRootView style={{flex: 1, backgroundColor: 'lightblue'}}>

                <MapView
                    style={{height, width}}
                    provider={PROVIDER_GOOGLE}
                    followUserLocation={true}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    showsCompass={true}
                    pitchEnabled={true}
                    scrollEnabled={true}
                    initialRegion={{
                        latitude: driverLocation.latitude,
                        longitude: driverLocation.longitude,
                        latitudeDelta: 0.12,
                        longitudeDelta: 0.12
                    }}
                >
                    {restaurants.map(restaurant=>
                        <Marker
                            key={restaurant.id}
                            title={restaurant.name}
                            description={restaurant.location.address}
                            coordinate={{
                                latitude: restaurant.location.lat,
                                longitude: restaurant.location.lng
                            }}>
                            <View style={{backgroundColor: 'green', padding: 5, borderRadius: 20}}>
                                <Entypo name="shop" size={24} color="white"/>
                            </View>
                        </Marker>
                    )}
                </MapView>
                <Ionicons
                    onPress={() => navigation.navigate('Profile',{toggle:true})}
                    name="arrow-back-circle"
                    size={45}
                    color="black"
                    style={{top: 40, left: 15, position: 'absolute'}}
                />
                <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
                    <View style={{alignItems: 'center', marginBottom: 30}}>
                        <Text style={{
                            fontSize: 20, fontWeight: '600', letterSpacing: 0.5, paddingBottom: 5
                        }}>You're Online</Text>
                        <Text style={{letterSpacing: 0.5, color: 'gray'}}>Available Orders: {orders.length}</Text>
                    </View>
                    <BottomSheetFlatList
                        data={ORCD}
                        renderItem={({item}) =>
                            <OrderItem
                                order={item.order}
                                restaurant ={item.restaurant}
                                customer={item.customer}
                                dishes={item.dishes}
                            />}
                    />
                </BottomSheet>
                <Button
                    onPress={async () => await Amplify.DataStore.clear().then(async () => await Amplify.DataStore.start())}
                    title="Amplify.DataStore.clear()"/>
                <Text
                    onPress={() => Auth.signOut()}
                    style={{textAlign: "center", color: 'red', margin: 10}}>
                    Sign out
                </Text>


            </GestureHandlerRootView>
            }
        </>
    );
};

export default OrdersScreen;
