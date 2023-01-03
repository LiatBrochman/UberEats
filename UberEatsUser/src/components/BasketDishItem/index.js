import {Image, StyleSheet, Text, View} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import {useBasketContext} from "../../contexts/BasketContext";




const BasketDishItem = ({dish}) => {
    const {removeDishFromBasket} = useBasketContext()

    return (
        <View style={styles.row}>
            <View style={styles.quantityContainer}>
                <Text>{dish?.quantity}</Text>
            </View>
            <Image
                source={{uri: dish?.image}}
                style={styles.image}/>
            <Text style={styles.dishName}>{dish?.name}</Text>
            <Text style={styles.dishPrice}>$ {dish?.price}</Text>
            <>
                {dish?.basketID && <AntDesign
                    name="closesquareo"
                    size={20}
                    color={"darkred"}
                    onPress={()=> removeDishFromBasket({dish})}
                />}
            </>

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
        backgroundColor: 'lightgray',
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
