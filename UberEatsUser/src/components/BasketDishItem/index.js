import {Image, StyleSheet, Text, View} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import {useBasketContext} from "../../contexts/BasketContext";


const BasketDishItem = ({dish}) => {
    const {removeDishFromBasket, addDishToBasket} = useBasketContext()


    const onMinus = async () => {
        if (dish.quantity > 1)
            await addDishToBasket({dish: {...dish, quantity: dish.quantity - 1}})
    }

    const onPlus = async () => {
        await addDishToBasket({dish: {...dish, quantity: dish.quantity + 1}})
    }

    const onRemove = async () => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ removing dish ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(dish, null, 4))

        await removeDishFromBasket({dish})
    }

    return (
        <View style={styles.row}>
            <View style={styles.quantityContainer}>

                {
                    dish?.basketID && dish?.basketID !== "null" &&
                    <AntDesign
                        name="plussquareo"
                        size={15}
                        color={"black"}
                        onPress={onPlus}
                    />
                }

                <Text style={{textAlign: "center"}}>{dish?.quantity}</Text>

                {
                    dish?.basketID && dish?.basketID !== "null" &&
                    <AntDesign
                        name="minussquareo"
                        size={15}
                        color={"black"}
                        onPress={onMinus}
                    />
                }
            </View>
            <Image
                source={{uri: dish?.image}}
                style={styles.image}/>
            <Text style={styles.dishName}>{dish?.name}</Text>
            <Text style={styles.dishPrice}>$ {dish?.price}</Text>

            {
                dish?.basketID && dish?.basketID !== "null" &&
                <AntDesign
                    name="closesquareo"
                    size={20}
                    color={"darkred"}
                    onPress={onRemove}
                />
            }


        </View>
    )
}

export default BasketDishItem;


const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 15,
    },
    quantityContainer: {
        paddingHorizontal: 5,
        paddingVertical: 2,
        marginRight: 10,
        borderRadius: 3,
    },
    dishName: {
        fontWeight: '600'
    },
    dishPrice: {
        marginLeft: "auto",
        marginRight: 10,
    },
    image: {
        width: '25%',
        aspectRatio: 5 / 3,
    }
})
