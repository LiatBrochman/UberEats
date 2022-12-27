import {Image, StyleSheet, Text, View} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import {useBasketContext} from "../../contexts/BasketContext";


const OrderDishItem = ({dish}) => {

    return (
        <>
            {dish.isDeleted === false &&
            <View style={styles.row}>
                <View style={{flexDirection: "column"}}>

                    <View style={styles.quantityContainer}>
                        <Text>{dish?.quantity}</Text>
                    </View>

                </View>
                <Image
                    source={{uri: dish?.image}}
                    style={styles.image}/>
                <Text style={styles.dishName}>{dish?.name}</Text>
                <Text style={styles.dishPrice}>$ {dish?.price}</Text>

            </View>
            }
        </>

    )
}

export default OrderDishItem;


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