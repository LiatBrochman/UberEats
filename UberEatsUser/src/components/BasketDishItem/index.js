import {Image, StyleSheet, Text, View} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import {useBasketContext} from "../../contexts/BasketContext";


const BasketDishItem = ({dish}) => {
    const {removeDishFromBasket} = useBasketContext()
    return (
        <>
            {dish.isDeleted === false &&
            <View style={styles.row}>
                <View style={{flexDirection: "column"}}>
                    <AntDesign
                        name="plussquareo"
                        size={17}
                        color={"black"}
                        // onPress={}
                    />
                    <View style={styles.quantityContainer}>
                        <Text>{dish?.quantity}</Text>
                    </View>
                    <AntDesign
                        name="minussquareo"
                        size={17}
                        color={"black"}
                        // onPress={}
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
                    onPress={() => removeDishFromBasket({dish})}
                />
            </View>
            }
        </>

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