import {FlatList, Pressable, StyleSheet, Text, View} from "react-native";
import BasketDishItem from "../../components/BasketDishItem";
import {useBasketContext} from "../../contexts/BasketContext";
import {useOrderContext} from "../../contexts/OrderContext";
import {useNavigation} from "@react-navigation/native";
import {useRestaurantContext} from "../../contexts/RestaurantContext";
import {useEffect} from "react";


const Basket = () => {
    const {basketDishes, totalPrice} = useBasketContext()
    const {restaurant} = useRestaurantContext()
    const {createNewOrder} = useOrderContext()
    const navigation = useNavigation()

    useEffect(() => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~Basket page: basketDishes ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(basketDishes, null, 4))
    }, [basketDishes])

    const onCreateOrder = async () => {
        if (totalPrice && restaurant?.deliveryFee && totalPrice > restaurant.deliveryFee) {
            await createNewOrder()
            navigation.goBack()
        }
    }

    return (
        <View style={styles.page}>
            <Text style={styles.name}>{restaurant?.name}</Text>

            <Text style={styles.title}>Your items</Text>

            <FlatList

                data={basketDishes}
                renderItem={({item}) => <BasketDishItem dish={item}/>}


            />
            <Text>Delivery Fee : ${restaurant?.deliveryFee}</Text>

            <View style={styles.separator}/>
            <Pressable onPress={onCreateOrder} style={styles.button}>
                <Text style={styles.buttonText}>Create order &#8226; ${totalPrice}</Text>
            </Pressable>
        </View>
    )
}


const styles = StyleSheet.create({
    page: {
        flex: 1,
        width: "100%",
        paddingVertical: 40,
        padding: 10,
        backgroundColor: "white"
    },
    name: {
        fontSize: 24,
        fontWeight: "600",
        marginVertical: 10,
    },
    description: {
        color: "gray",
    },
    separator: {
        height: 1,
        backgroundColor: "lightgrey",
        marginVertical: 10,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 15,
        paddingHorizontal: 10,
    },
    quantity: {
        fontSize: 25,
        marginHorizontal: 20,
    },
    button: {
        backgroundColor: "#FFAD60",
        marginTop: "auto",
        padding: 20,
        alignItems: "center",
        margin: 10,
        borderRadius: 20,
    },
    buttonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 18,
    },
    quantityContainer: {
        backgroundColor: "lightgray",
        paddingHorizontal: 5,
        paddingVertical: 2,
        marginRight: 10,
        borderRadius: 3,
    },
    title: {
        fontWeight: "bold",
        marginTop: 20,
        fontSize: 19
    },
});

export default Basket;
