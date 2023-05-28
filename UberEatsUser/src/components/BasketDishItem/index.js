import {StyleSheet, Text, View} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import {useBasketContext} from "../../contexts/BasketContext";
import CachedImage from '../../myExternalLibrary/CachedImage';
// import _ from 'lodash';

const BasketDishItem = ({dish}) => {
    const {removeDishFromBasket, addDishToBasket,updateDishQuantity} = useBasketContext()
    // const debouncedAddDishToBasket = _.debounce(addDishToBasket, 500)

    const onMinus = async () => {
        if (dish.quantity > 1)
            await updateDishQuantity( {dish, quantity: dish.quantity - 1})

        // await addDishToBasket( {...dish, quantity: dish.quantity - 1})
            // await debouncedAddDishToBasket( {...dish, quantity: dish.quantity - 1})
    }

    const onPlus = async () => {
        await updateDishQuantity({dish, quantity:dish.quantity + 1})

        // await addDishToBasket({...dish, quantity:dish.quantity + 1})
        // await debouncedAddDishToBasket({...dish, quantity:dish.quantity + 1})
    }

    const onRemove = async () => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ removing dish ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(dish, null, 4))

        await removeDishFromBasket(dish)
    }

    return (
        <View style={{backgroundColor: "white"}}>

            <View style={styles.row}>
                <CachedImage
                    source={{uri: dish?.image}}
                    style={styles.image}/>
                <Text style={styles.dishName}>{dish?.name}</Text>
                <Text style={styles.dishPrice}>${dish?.price}</Text>

                {
                    dish?.basketID && dish?.basketID !== "null" &&
                    <AntDesign
                        name="closesquare"
                        size={30}
                        color={"#D9534F"}
                        onPress={onRemove}
                    />
                }


            </View>
            {
                dish?.basketID && dish?.basketID !== "null" &&

                <View style={styles.quantityContainer}>


                    <AntDesign
                        name="plus"
                        size={20}
                        color={"black"}
                        onPress={onPlus}
                    />


                    <Text style={{textAlign: "center"}}>  {dish?.quantity}  </Text>


                    <AntDesign
                        name="minus"
                        size={20}
                        color={"black"}
                        onPress={onMinus}
                    />

                </View>
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
        backgroundColor: "white",


    },
    quantityContainer: {
        flexDirection: "row",
        paddingHorizontal: 12,
        paddingVertical: 2,
        // marginRight: 305,
        // marginLeft: 5,
        // borderRadius: 5,
        backgroundColor: "#96CEB4",
        marginTop: -25,
        // paddingRight: 5,
        alignSelf: "flex-start",
        width: '22%',
        marginLeft: 10,


    },
    dishName: {
        fontWeight: '600',
        marginLeft: -80,
    },
    dishPrice: {
        marginLeft: "auto",
        marginRight: 10,
    },
    image: {
        width: '45.5%',
        aspectRatio: 5 / 4,
        borderRadius: 10,
        alignSelf: "flex-start",
        marginLeft: 10,
         //marginTop: 12,


    }
})
