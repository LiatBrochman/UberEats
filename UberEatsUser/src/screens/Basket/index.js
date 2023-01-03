import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import BasketDishItem from "../../components/BasketDishItem";
import {useBasketContext} from "../../contexts/BasketContext";
import {useOrderContext} from "../../contexts/OrderContext";
import { useNavigation } from "@react-navigation/native";
import {useRestaurantContext} from "../../contexts/RestaurantContext";


const Basket = () => {
    const {dishes, totalPrice} = useBasketContext()
    const {restaurant} = useRestaurantContext()
    const {createOrder} = useOrderContext()
    const navigation = useNavigation()

    const onCreateOrder = async () => {
        await createOrder()
        navigation.goBack()
    };

    return (
        <View style={styles.page}>
            <Text style={styles.name}>{restaurant?.name}</Text>

            <Text style={styles.title}>Your items</Text>

            <FlatList

                data={dishes}
                renderItem={({item}) => <BasketDishItem dish={item}/>}


            />
            <Text>Delivery Fee : $ {restaurant?.deliveryFee}</Text>

            <View style={styles.separator}/>
            <Pressable onPress={onCreateOrder} style={styles.button}>
                <Text style={styles.buttonText}>Create order &#8226; $ {totalPrice}</Text>
            </Pressable>
        </View>
    );
};


const styles = StyleSheet.create({
    page: {
        flex: 1,
        width: "100%",
        paddingVertical: 40, // temp fix
        padding: 10,
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
        backgroundColor: "black",
        marginTop: "auto",
        padding: 20,
        alignItems: "center",
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
