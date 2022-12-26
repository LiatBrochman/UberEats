import {Image, StyleSheet, Text, View} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import {useBasketContext} from "../../contexts/BasketContext";
import {useEffect, useState} from "react";




const BasketDishItem = () => {
    const {removeDishFromBasket, quantity, setQuantity, addDishToBasket, dish} = useBasketContext()
    //const [quantity,setQuantity] = useState(1)
    //

    const onMinus = async () => {
        if (quantity > 1) {
            setQuantity(quantity - 1)
            dish.quantity = quantity
            await addDishToBasket({dish})
        }

    }

    const onPlus = async () => {
        setQuantity(quantity + 1)
        dish.quantity = quantity
        await addDishToBasket({dish})
    }


    return (
        <View style={styles.row}>
            <View style={{flexDirection:"column"}}>
            <AntDesign
                name="plussquareo"
                size={17}
                color={"black"}
                 onPress={onPlus}
            />
            <View style={styles.quantityContainer}>
                <Text>{quantity}</Text>
            </View>
                <AntDesign
                    name="minussquareo"
                    size={17}
                    color={"black"}
                     onPress={onMinus}
                />
            </View>
            <Image
                source={{uri: dish?.image}}
                style={styles.image}/>
            <Text style={styles.dishName}>{dish?.name}</Text>
            <Text style={styles.dishPrice}>$ {dish?.price}</Text>
            <AntDesign
                name="closesquareo"
                size={20}
                color={"darkred"}
                onPress={()=> removeDishFromBasket({dish})}
            />
        </View>
    )
}

export default BasketDishItem;


const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
    },
    quantityContainer: {
        backgroundColor: 'lightgray',
        paddingHorizontal: 5,
        paddingVertical: 2,
        marginRight: 10,
        borderRadius: 3,
        marginBottom: 5,
        marginTop: 5,
    },
    dishName: {
        fontWeight: '600',
        marginLeft: 15,
    },
    dishPrice: {
        marginLeft: "auto",
        marginRight: 10,
    },
    image: {
        width: '30%',
        aspectRatio: 5 / 3,
    }
})
