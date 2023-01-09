import {Image, StyleSheet, Text, View} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import {useBasketContext} from "../../contexts/BasketContext";
import {useEffect} from "react";


const BasketDishItem = ({dish}) => {
    const {removeDishFromBasket,addDishToBasket} = useBasketContext()

    // useEffect(() => {
    //     if(dishes){
    //         console.log("\ndishes are being updated")
    //         // console.log(dishes.map(d=>({name:dish.name,quantity:d.quantity})))
    //     }
    // }, [dishes]);


    const onMinus = async () => {
        await addDishToBasket({dish:{...dish,quantity:dish.quantity-1}})
    }

    const onPlus = async () => {
        await addDishToBasket({dish:{...dish,quantity:dish.quantity+1}})
    }

    const onRemove = async ()=>{
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ removing dish ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(dish,null,4))

         await removeDishFromBasket({dish})
    }

    return (
        <View style={styles.row}>
            <View style={styles.quantityContainer}>
                <AntDesign
                    name="plussquareo"
                    size={15}
                    color={"black"}
                    onPress={onPlus}
                />
                <Text style={{textAlign:"center"}}>{dish?.quantity}</Text>
                <AntDesign
                    name="minussquareo"
                    size={15}
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
                onPress={onRemove}
            />


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
