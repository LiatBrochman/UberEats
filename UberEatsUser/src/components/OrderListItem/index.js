import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {useEffect, useState} from "react";
import {DataStore} from "aws-amplify";
import {Restaurant} from "../../models";
import {useOrderContext} from "../../contexts/OrderContext";
import {useRestaurantContext} from "../../contexts/RestaurantContext";
import CachedImage from 'expo-cached-image';
import {FIRST_USERNAME_INDEX} from "../../myExternalLibrary/runOnInit";


const getDate = ({order}) => {
    if (order && order?.createdAt) {
        let date = new Date(order.createdAt)
        return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()
    }
}
const getTime = ({order}) => {
    if (order && order?.createdAt) {
        let date = new Date(order.createdAt)
        return date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
    }
}
const getDaysAgo = ({order}) => {
    if (order && order?.createdAt) {
        let date = (new Date(order.createdAt)).getTime()
        let now = (new Date()).getTime()
        return ((now - date) / 86400000).toFixed(0)
    }
}

const OrderListItem = ({order}) => {

    const navigation = useNavigation()
    const {setRestaurant: setRealRestaurant} = useRestaurantContext()
    const {setOrder} = useOrderContext()
    const [restaurant, setRestaurant] = useState(null)

    useEffect(() => {
        DataStore.query(Restaurant, order.restaurantID).then(setRestaurant)
    }, [order])

    return (
        <Pressable
            onPress={() => {
                console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ clicked on order: ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(order, null, 4))
                setRealRestaurant(restaurant)
                setOrder(order)
                navigation.navigate("Order", {id: order.id})
            }}
            style={styles.container}>
            {restaurant?.image &&
            <CachedImage
                source={{uri: restaurant.image}}
                cacheKey={restaurant.image.substring(FIRST_USERNAME_INDEX)}
                style={styles.image}
            />}
            <View>
                <Text style={styles.name}>{restaurant?.name}</Text>
                <Text style={styles.price}>{order?.totalQuantity} items &#8226; ${order?.totalPrice}</Text>
                <Text>{getDate({order})} {getTime({order})} </Text>
                <Text style={styles.subtitle}>
                    &#8226;{order.status}&#8226; {getDaysAgo({order})} days ago
                </Text>
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
        marginRight: 5,
        borderRadius: 10,
    },
    name: {
        fontWeight: "600",
        fontSize: 16
    },
    price: {
        marginVertical: 5
    },
    subtitle: {
        fontSize: 15,
        color: "#D9534F",
        textAlign: "center",
        backgroundColor: "white",

    }
})
