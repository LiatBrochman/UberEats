import {Image, StyleSheet, Text, View} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import {useBasketContext} from "../../contexts/BasketContext";
import {useState} from "react";
import {getDish_ByID} from "../../contexts/Queries";


const BasketDishItem = ({dish}) => {
    const {removeDishFromBasket,addDishToBasket,updateDishQuantity} = useBasketContext()
    // const [dish,setDish] = useState()
    // const [quantity,setQuantity] = useState(0)

    const onAddToBasket = async () => {
        dish.quantity = quantity
        await addDishToBasket({dish})
    }
    const onMinus = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1)
        }
    }
    const onPlus = () => {
        setQuantity(quantity + 1)
    }

    return (
        <>
            {dish.isDeleted === false &&
            <View style={styles.row}>
                <View style={{flexDirection: "column"}}>
                    <AntDesign
                        name="plussquareo"
                        size={17}
                        color={"black"}
                        onPress={async()=>{
                           // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ restaurant dish ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(await getDish_ByID({id:dish?.originalID}),null,4))
                           // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ basket dish ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(dish,null,4))
                            return await updateDishQuantity({existingDish:dish,quantity:dish.quantity+1})
                            // return await addDishToBasket({...dish,id:dish.originalID,quantity:dish.quantity+1})
                        }}
                    />
                    <View style={styles.quantityContainer}>
                        <Text>{dish?.quantity}</Text>
                    </View>
                    <AntDesign
                        name="minussquareo"
                        size={17}
                        color={"black"}
                        onPress={async()=>{
                            return await updateDishQuantity({existingDish:dish,quantity:dish.quantity-1})
                            //await addDishToBasket({...dish,id:dish.originalID,quantity:dish.quantity-1})
                        }}
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