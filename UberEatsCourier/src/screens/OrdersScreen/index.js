import {useRef, useMemo, useState, useEffect} from "react";
import {Text, View, useWindowDimensions} from 'react-native';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet'
import {GestureHandlerRootView, FlatList} from 'react-native-gesture-handler'
import OrderItem from '../../components/OrderItem';
import MapView, {Marker} from "react-native-maps";
import {Entypo} from "@expo/vector-icons";
import {DataStore} from 'aws-amplify'
import {Order, Restaurant} from '../../models'


const OrdersScreen = () => {
    const [orders, setOrders] = useState([])
    const [restaurants, setRestaurants] = useState([])

    const bottomSheetRef = useRef(null);
    const {width, height} = useWindowDimensions();

    const snapPoints = useMemo(() => ["12%", "95%"], [])

    useEffect(() => {
        DataStore.query(Order, (order) => order.status.eq("READY_FOR_PICKUP")).then(setOrders);
        DataStore.query(Restaurant).then(setRestaurants)
    }, [])

    return (
        orders[0] && restaurants[0] && <GestureHandlerRootView style={{flex: 1, backgroundColor: 'lightblue'}}>
            <MapView
                style={{height, width}}
                showsUserLocation
                followUserLocation
            >
                {orders.map((order) => {
                    const restaurant = restaurants.find(restaurant => restaurant.id === order.orderRestaurantId)
                    return (
                        <Marker
                            key={order.id}
                            title={restaurant.name}
                            description={restaurant.address}
                            coordinate={{
                                latitude: restaurant.lat,
                                longitude: restaurant.lng
                            }}>
                            <View style={{backgroundColor: 'green', padding: 5, borderRadius: 20}}>
                                <Entypo name="shop" size={24} color="white"/>
                            </View>
                        </Marker>
                    )
                })}

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
        </GestureHandlerRootView>
    );
};

export default OrdersScreen;
