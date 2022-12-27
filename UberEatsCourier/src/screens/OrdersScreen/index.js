import {useRef, useMemo, useState, useContext} from "react";
import {Text, View, useWindowDimensions, Button} from 'react-native';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import OrderItem from '../../components/OrderItem';
import MapView, {Marker} from "react-native-maps";
import {Entypo, Ionicons} from "@expo/vector-icons";
import {Amplify, Auth} from "aws-amplify";
import {useNavigation} from '@react-navigation/native'
import OrderContext from "../../contexts/OrderContext";


const OrdersScreen = () => {
    const [orders, setOrders] = useState([])
    const [restaurants, setRestaurants] = useState([])
   // const {restaurants, orders} = OrderContext;
    const bottomSheetRef = useRef(null);
    const {width, height} = useWindowDimensions();
    const navigation = useNavigation()

    const snapPoints = useMemo(() => ["12%", "95%"], [])


    //orders[0] && restaurants[0] && <GestureHandlerRootView style={{flex: 1, backgroundColor: 'lightblue'}}>
    return (
        //restaurants[0] && <GestureHandlerRootView style={{flex: 1, backgroundColor: 'lightblue'}}>
        <GestureHandlerRootView style={{flex: 1, backgroundColor: 'lightblue'}}>
            {console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ orders ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(orders,null,4))}
            {/*{console.log("\n\n.............second touch")}*/}
            <MapView
                style={{height, width}}
                showsCustomerLocation
                followCutomerLocation
            >
                {orders.map((order) => {
                    const restaurant = restaurants.find(restaurant => restaurant.id === order.restaurantID)
                    return (
                        <Marker
                            key={order.id}
                            title={restaurant.name}
                            description={restaurant.Location.address}
                            coordinate={{
                                latitude: restaurant.Location.lat,
                                longitude: restaurant.Location.lng
                            }}>
                            <View style={{backgroundColor: 'green', padding: 5, borderRadius: 20}}>
                                <Entypo name="shop" size={24} color="white"/>
                            </View>
                        </Marker>
                    )
                })}

            </MapView>
            {/*<Ionicons*/}
            {/*    onPress={() => navigation.goBack()}*/}
            {/*    name="arrow-back-circle"*/}
            {/*    size={45}*/}
            {/*    color="black"*/}
            {/*    style={{top: 40, left: 15, position: 'absolute'}}*/}
            {/*/>*/}
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
            {/*<Text*/}
            {/*    onPress={() => Auth.signOut()}*/}
            {/*    style={{textAlign: "center", color: 'red', margin: 10}}>*/}
            {/*    Sign out*/}
            {/*</Text>*/}
            {/*<Button onPress={async () => await Amplify.DataStore.clear()} title="Amplify.DataStore.clear()"/>*/}


        </GestureHandlerRootView>
    );
};

export default OrdersScreen;
