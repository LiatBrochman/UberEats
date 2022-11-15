import {StyleSheet, Text, View} from "react-native";
import restaurants from "../../../assets/data/restaurants.json";

const restaurant = restaurants[0];
const BasketDishItem = ({basketDish}) => {
    return (
        <View style={styles.row}>
            <View style={styles.quantityContainer}>
                <Text>1</Text>
            </View>
            <Text style={styles.basketDishName}>{basketDish.name}</Text>
            <Text style={styles.basketDishPrice}>$ {basketDish.price}</Text>
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
        marginVertical: 2,
        marginRight: 10,
        borderRadius: 3,
    },
    basketDishName: {
        fontWeight: '600'
    },
    basketDishPrice: {
        marginLeft: "auto"
    },
})
