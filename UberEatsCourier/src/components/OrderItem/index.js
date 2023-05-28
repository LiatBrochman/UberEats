import {Pressable, Text, View} from "react-native";
import {Entypo} from "@expo/vector-icons";
import {useOrderContext} from "../../contexts/OrderContext";
import {DataStore} from "aws-amplify";
import {Customer, Restaurant} from "../../models";
import {useEffect, useState} from "react";
import CachedImage from "../../myExternalLibrary/CachedImage"


const OrderItem = ({order}) => {
    const {
        pressOn_Order
    } = useOrderContext()
    const [restaurant, setRestaurant] = useState(null)
    const [customer, setCustomer] = useState(null)

    if (!order) return

    useEffect(() => {
        if (!order) return

        DataStore.query(Restaurant, order.restaurantID)
            .then(setRestaurant)

        DataStore.query(Customer, order.customerID)
            .then(setCustomer)

    }, [order])


    return (

        <Pressable style={{
            flexDirection: "row",
            margin: 10,
            borderColor: "#96CEB4",
            borderWidth: 2,
            borderRadius: 12,
        }}
                   onPress={() => {
                       pressOn_Order(order)
                       // navigation.navigate('OrdersDeliveryScreen')
                   }}
        >
            <CachedImage
                source={{uri: restaurant?.image}}
                style={{
                    width: "25%",
                    height: "100%",
                    borderBottomLeftRadius: 10,
                    borderTopLeftRadius: 10,
                }}
            />
            <View style={{flex: 1, marginLeft: 10, marginRight: 10, paddingVertical: 5}}>
                <Text style={{fontSize: 18, fontWeight: "500"}}>
                    {restaurant?.name}
                </Text>
                <Text style={{color: "black"}}>{restaurant?.location?.address}</Text>
                <Text style={{color: "black"}}>{order.status}</Text>
                <Text style={{marginTop: 10}}>Delivery Details:</Text>
                <Text style={{color: "black"}}>{customer?.name}</Text>
                <Text style={{color: "black"}}>{customer?.location?.address}</Text>
            </View>
            <View
                style={{
                    padding: 5,
                    backgroundColor: "#96CEB4",
                    borderBottomRightRadius: 10,
                    borderTopRightRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Entypo
                    name="check"
                    size={30}
                    color="white"
                    style={{marginLeft: "auto"}}
                />
            </View>
        </Pressable>

    )
}

export default OrderItem;

