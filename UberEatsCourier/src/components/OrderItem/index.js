import {StyleSheet, Text, View, Image, Pressable} from "react-native";
import {Entypo} from "@expo/vector-icons";
import {useNavigation} from '@react-navigation/native'
import {useState, useEffect} from "react";
import {DataStore} from "aws-amplify";
import {Order, Restaurant, Customer} from '../../models';


const OrderItem = ({order}) => {
    const [customer, setCustomer] = useState(null)
    const [restaurant, setRestaurant] = useState(null)
    const navigation = useNavigation()

    useEffect(() => {
        if (order?.id) {
            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ order item ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(order, null, 4))

            DataStore.query(Customer, order.customerID).then(setCustomer)
            DataStore.query(Restaurant, order.restaurantID).then(setRestaurant)
        }
    }, [order])

    return (
        restaurant?.image && (
            <Pressable style={{
                flexDirection: "row",
                margin: 10,
                borderColor: "#3FC060",
                borderWidth: 2,
                borderRadius: 12,
            }}
                       onPress={() => navigation.navigate('OrdersDeliveryScreen', {id: order.id})}
            >
                <Image
                    source={{uri: restaurant.image}}
                    style={{
                        width: "25%",
                        height: "100%",
                        borderBottomLeftRadius: 10,
                        borderTopLeftRadius: 10,
                    }}
                />
                <View style={{flex: 1, marginLeft: 10, paddingVertical: 5}}>
                    <Text style={{fontSize: 18, fontWeight: "500"}}>
                        {restaurant.name}
                    </Text>
                    <Text style={{color: "grey"}}>{restaurant.location.address}</Text>

                    <Text style={{marginTop: 10}}>Delivery Details:</Text>
                    <Text style={{color: "grey"}}>{customer?.name}</Text>
                    <Text style={{color: "grey"}}>{customer?.location.address}</Text>
                </View>
                <View
                    style={{
                        padding: 5,
                        backgroundColor: "#3FC060",
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

        ))
}

export default OrderItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
    },
});
