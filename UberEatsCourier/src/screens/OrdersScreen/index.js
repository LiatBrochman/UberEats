import {useRef, useMemo, useState, useEffect} from "react";
import {Text, View, useWindowDimensions} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet'
import {GestureHandlerRootView, FlatList} from 'react-native-gesture-handler'
import orders from "../../../assets/data/orders.json"
import OrderItem from '../../components/OrderItem';
import MapView, {Marker} from "react-native-maps";
import {Entypo} from "@expo/vector-icons";
import {DataStore} from 'aws-amplify'
import {Order} from '../../models'


const OrdersScreen = () => {
    const [orders, setOrders] = useState([])
    const bottomSheetRef = useRef(null);
    const {width, height} = useWindowDimensions();

    const snapPoints = useMemo(() => ["12%", "95%"], [])

    useEffect(() => {
        DataStore.query(Order).then(setOrders);
    }, [])

    return (
        <GestureHandlerRootView style={{flex: 1, backgroundColor: 'lightblue'}}>
            <MapView
                style={{height, width}}
                showsUserLocation
                followUserLocation
            >
                {orders.map((order) => (
                    <Marker
                        key={order.id}
                        title={order.Restaurant.name}
                        description={order.Restaurant.address}
                        coordinate={{
                            latitude: order.Restaurant.lat,
                            longitude: order.Restaurant.lng
                        }}>
                        <View style={{backgroundColor: 'green', padding: 5, borderRadius: 20}}>
                            <Entypo name="shop" size={24} color="white"/>
                        </View>
                    </Marker>
                ))}

            </MapView>
            <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
                <View style={{alignItems: 'center', marginBottom: 30}}>
                    <Text style={{
                        fontSize: 20, fontWeight: '600', letterSpacing: 0.5, paddingBottom: 5
                    }}>You're Online</Text>
                    <Text style={{letterSpacing: 0.5, color: 'gray'}}>Available Orders: {orders.length}</Text>
                </View>
                <FlatList
                    data={orders}
                    renderItem={({item}) => <OrderItem order={item}/>}
                />
            </BottomSheet>
        </GestureHandlerRootView>
    );
};

export default OrdersScreen;
