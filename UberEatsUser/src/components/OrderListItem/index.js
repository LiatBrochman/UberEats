import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {useEffect, useState} from "react";

import {DataStore} from "aws-amplify";
import {Restaurant} from "../../models";
import {useOrderContext} from "../../contexts/OrderContext";


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
        return (( now - date )/86400000).toFixed(0)
    }
}

const OrderListItem = ({order}) => {

    const navigation = useNavigation()
    const {setOrder} = useOrderContext()
    const [restaurant, setRestaurant] = useState({})

    useEffect(() => {
        DataStore.query(Restaurant, order.restaurantID).then(setRestaurant)
    }, [order])

    return (
        <Pressable
            onPress={() => {
                console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ clicked on order: ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(order, null, 4))

                setOrder(order)
                navigation.navigate("Order", {id: order.id})
            }}
            style={styles.container}>
            <Image
                source={{uri: restaurant?.image}}
                style={styles.image}
            />
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
