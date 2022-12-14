import {Image, StyleSheet, Text, View} from "react-native";




const BasketDishItem = ({dish}) => {
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
        marginLeft: "auto"
    },
    image: {
        width: '25%',
        aspectRatio: 5 / 3,
    }
})
