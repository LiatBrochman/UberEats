import {useRef, useMemo, useState, useEffect} from "react";
import {Text, View, useWindowDimensions, Button} from 'react-native';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import OrderItem from '../../components/OrderItem';
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import {Entypo} from "@expo/vector-icons";
import {Amplify, Auth, DataStore} from "aws-amplify";
import {useOrderContext} from "../../contexts/OrderContext";


export var subscription = {}

const OrdersScreen = () => {
    const {driverLocation, ORCD} = useOrderContext()
    const bottomSheetRef = useRef({})
    const {width, height} = useWindowDimensions()
    const snapPoints = useMemo(() => ["12%", "95%"], [])
     const [orders, setOrders] = useState([])
     const [restaurants, setRestaurants] = useState([])

    useEffect(()=>{
        if(ORCD && ORCD?.length > 0){
            setOrders(ORCD.map(all=>all.order))
            setRestaurants(ORCD.map(all=>all.restaurant))
        }
    },[ORCD])
    return (
        <>
            {ORCD?.length>0 && typeof ORCD[0].restaurant.location.lat ==='number' &&
            <GestureHandlerRootView style={{flex: 1, backgroundColor: 'lightblue'}}>
                <MapView
                    initialRegion={{
                        latitude: driverLocation.latitude,
                        longitude: driverLocation.longitude,
                        latitudeDelta: 0.12,
                        longitudeDelta: 0.12
                    }}
                    style={{height, width}}
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation={true}
                    followUserLocation={true}
                >
                    {restaurants.map(restaurant =>
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
                        </Marker>)
                    }

                </MapView>
                <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
                    <View style={{alignItems: 'center', marginBottom: 30}}>
                        <Text style={{
                            fontSize: 20, fontWeight: '600', letterSpacing: 0.5, paddingBottom: 5
                        }}>You're Online</Text>
                        <Text style={{letterSpacing: 0.5, color: 'gray'}}>Available Orders: {orders.length}</Text>
                    </View>
                    <BottomSheetFlatList
                        data={orders}
                        renderItem={({item}) => <OrderItem order={item}/>}
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
    )
}

export default OrdersScreen;
