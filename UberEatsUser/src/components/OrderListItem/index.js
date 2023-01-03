import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {useBasketContext} from "../../contexts/BasketContext";
import {getDate, getTime, getOrderQuantity,getRestaurant_byOrder} from "../../contexts/Queries"
import {useEffect, useState} from "react";
import {useRestaurantContext} from "../../contexts/RestaurantContext";

const OrderListItem = ({order}) => {
    // const {restaurant} = useBasketContext()
    // const {restaurant} = useRestaurantContext()
    const navigation = useNavigation()
    const [orderQuantity, setOrderQuantity] = useState(0)
    const [restaurant, setRestaurant]=useState()
    useEffect(() => {
        getOrderQuantity({order}).then(setOrderQuantity)
        getRestaurant_byOrder({order}).then(setRestaurant)
    }, [order])
    return (
        <Pressable
            onPress={() => navigation.navigate("Order", {id: order.id})}
            style={styles.container}>
            <Image
                source={{uri: restaurant?.image}}
                style={styles.image}
            />
            <View>
                <Text style={styles.name}>{restaurant?.name}</Text>
                <Text style={styles.price}>{orderQuantity} items &#8226; ${order.total}</Text>
                <Text>{getDate({order})} {getTime({order})} &#8226; {order?.status}</Text>
            </View>
        </Pressable>
    );
};

export default OrderListItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        margin: 10,
        alignItems: "center"
    },
    image: {
        width: 75,
        height: 75,
        marginRight: 5
    },
    name: {
        fontWeight: "600",
        fontSize: 16
    },
    price: {
        marginVertical: 5
    },
})
