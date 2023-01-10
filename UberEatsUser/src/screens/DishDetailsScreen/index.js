import {useState, useEffect} from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ActivityIndicator,
} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import {useNavigation, useRoute} from "@react-navigation/native";
import {useBasketContext} from "../../contexts/BasketContext";
import {useRestaurantContext} from "../../contexts/RestaurantContext";

const DishDetailsScreen = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const id = route.params?.id;

    const {addDishToBasket, quantity:realQuantity, basket} = useBasketContext()
    const {restaurantDishes} = useRestaurantContext()
    const [dish,setDish]= useState(restaurantDishes?.[0])
    const [tempQuantity,setTempQuantity] = useState(realQuantity||1)

    useEffect(()=>{
        setTempQuantity(realQuantity||1)
    },[realQuantity])
    useEffect(()=>{
        restaurantDishes?.[0] && setDish(restaurantDishes.find(d=>d.id===id))
    },[restaurantDishes])


    const onAddToBasket = async () => {
        const clonedDish = {dish:{...dish,quantity: tempQuantity,basketID:basket?.id}}
        await addDishToBasket(clonedDish)
        navigation.goBack()
    }

    const onMinus = () => {
        if (tempQuantity > 1) {
            setTempQuantity(tempQuantity - 1)
        }
    }

    const onPlus = () => {
        setTempQuantity(tempQuantity + 1)
    }


    if (!dish) {
        return <ActivityIndicator size="large" color="gray"/>;
    }

    return (
        <View style={styles.page}>
            <Text style={styles.name}>{dish?.name}</Text>
            <Text style={styles.description}>{dish?.description}</Text>
            <View style={styles.separator}/>

            <View style={styles.row}>
                <AntDesign
                    name="minuscircleo"
                    size={60}
                    color={"black"}
                    onPress={onMinus}
                />
                <Text style={styles.quantity}>{tempQuantity}</Text>
                <AntDesign
                    name="pluscircleo"
                    size={60}
                    color={"black"}
                    onPress={onPlus}
                />
            </View>

            <Pressable onPress={onAddToBasket} style={styles.button}>
                <Text style={styles.buttonText}>
                    Add {tempQuantity} to basket &#8226; ${dish.price * tempQuantity}
                </Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    page: {
        flex: 1,
        width: "100%",
        paddingVertical: 40,
        padding: 10,
    },
    name: {
        fontSize: 30,
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
        justifyContent: "center",
        marginTop: 50,
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
});

export default DishDetailsScreen;
