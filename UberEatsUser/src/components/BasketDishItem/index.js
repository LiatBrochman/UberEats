import {Image, StyleSheet, Text, View} from "react-native";

const BasketDishItem = ({basketDish}) => {
    return (
        <View style={styles.row}>
            <View style={styles.quantityContainer}>
                <Text>{basketDish.quantity}</Text>
            </View>
            <Text style={styles.basketDishName}>{basketDish.Dish['_z'].name}</Text>
            <Text style={styles.basketDishPrice}>$ {basketDish.Dish['_z'].price}</Text>
            <Image source={{uri: basketDish.Dish['_z'].image}} style={styles.image}/>
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
    image: {
        width: '100%',
        aspectRatio: 5 / 3,
    }
})
