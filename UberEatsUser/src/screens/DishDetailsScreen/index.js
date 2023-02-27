import {useEffect, useState} from "react";
import {ActivityIndicator, Image, Pressable, StyleSheet, Text, View,} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import {useNavigation, useRoute} from "@react-navigation/native";
import {useBasketContext} from "../../contexts/BasketContext";
import {useRestaurantContext} from "../../contexts/RestaurantContext";

const DishDetailsScreen = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const id = route.params?.id;

    const {addDishToBasket, basket , basketDishes} = useBasketContext({basketDishes:[]})
    const {restaurantDishes} = useRestaurantContext({restaurantDishes:[]})
    const [restaurantDish, setRestaurantDish] = useState(null)
    const [tempQuantity, setTempQuantity] = useState(1)


    useEffect(() => {
        if(restaurantDishes.length === 0) return;
        setRestaurantDish(restaurantDishes.find(d => d.id === id))


        if(basketDishes.length===0) return;
        const existingDish = basketDishes.find(d=> d.originalID === id)
        existingDish && setTempQuantity(existingDish.quantity)

    }, [restaurantDishes])


    const onAddToBasket = async () => {
        const clonedDish = {dish: {...restaurantDish, quantity: tempQuantity, basketID: basket?.id}}
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


    if (!restaurantDish) {
        return <ActivityIndicator size="large" color="gray"/>;
    }

    return (
        <View style={styles.page}>

            <Image source={{uri: restaurantDish?.image}} style={styles.image}/>


            <Text style={styles.name}>{restaurantDish?.name}</Text>
            <Text style={styles.description}>{restaurantDish?.description}</Text>
            <View style={styles.separator}/>

            <View style={styles.row}>
                <AntDesign
                    name="minussquare"
                    size={30}
                    color={"#FFAD60"}
                    onPress={onMinus}
                />
                <Text style={styles.quantity}>{tempQuantity}</Text>
                <AntDesign
                    name="plussquare"
                    size={30}
                    color={"#FFAD60"}
                    onPress={onPlus}
                />
            </View>


            <Pressable onPress={onAddToBasket} style={styles.button}>
                <Text style={styles.buttonText}>
                    Add {tempQuantity} to basket &#8226; ${(restaurantDish.price * tempQuantity).toFixed(2)}
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
        backgroundColor: "white"
    },
    name: {
        fontSize: 30,
        fontWeight: "600",
        marginVertical: 10,
    },
    description: {
        color: "#3d3d3d",
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
        backgroundColor: "#96CEB4",
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
    image: {
        width: "100%",
        aspectRatio: 5 / 3,
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
    }
});

export default DishDetailsScreen;
