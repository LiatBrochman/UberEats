import {useState, useEffect, useReducer} from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ActivityIndicator,
} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import {useNavigation, useRoute} from "@react-navigation/native";
import {DataStore} from "aws-amplify";
import {Dish} from "../../models";
import {useBasketContext} from "../../contexts/BasketContext";
import {useDishContext} from "../../contexts/DishContext";
import {getDishQuantity} from "../../contexts/Queries";

const DishDetailsScreen = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const id = route.params?.id;
    // const [dish,setDish] = useState()
    const {dish, addDishToBasket} = useDishContext()
    const {basket} = useBasketContext()
    // const initial={
    //     getDishQuantity:(async()=>{
    //         return basket ? await getDishQuantity({basket,dish_of_restaurant:dish}) : 1
    //     })()
    // }
    // const [quantity,setQuantity] = useState(initial?.getDishQuantity || 1)
    const [quantity, setQuantity] = useState(1)

    const onAddToBasket = async () => {
        // dish.quantity = quantity
        const _ = require("lodash")
        let tempDish = _.cloneDeep(dish)
        tempDish.quantity = quantity
        delete tempDish.createdAt
        delete tempDish.updatedAt
        delete tempDish._version
        delete tempDish._lastChangedAt
        delete tempDish._deleted

        // tempDish= {...dish,quantity:quantity,createdAt:undefined,updatedAt:undefined}
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ tempDish ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(tempDish, null, 4))
        await addDishToBasket({dish:tempDish})
        navigation.goBack()
    }

    const onMinus = () => {
        if (quantity > 1) {
            // setTempDish({...originDish,quantity: quantity - 1})
            setQuantity(quantity - 1)
        }
    }

    const onPlus = () => {
        // setDish({...dish,quantity: quantity + 1})
        setQuantity(quantity + 1)
    }

    const getTotal = () => {
        // return (dish?.price * dish.quantity).toFixed(2)
        return (dish?.price * quantity).toFixed(2)
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
                <Text style={styles.quantity}>{quantity}</Text>
                <AntDesign
                    name="pluscircleo"
                    size={60}
                    color={"black"}
                    onPress={onPlus}
                />
            </View>

            <Pressable onPress={onAddToBasket} style={styles.button}>
                <Text style={styles.buttonText}>
                    Add {quantity} to basket &#8226; ${getTotal()}
                </Text>
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
