import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import BasketDishItem from '../../components/BasketDishItem';
import {useBasketContext} from "../../contexts/BasketContext";
import {useOrderContext} from '../../contexts/OrderContext';
import {useNavigation} from '@react-navigation/native'

const Basket = () => {
    const {restaurant, basketDishes, totalPrice} = useBasketContext();
    const {createOrder} = useOrderContext();
    const navigation = useNavigation();

    const onCreateOrder = async () => {
        await createOrder();
        navigation.goBack();

    }

    return (
        <View style={styles.page}>
            <Text style={styles.name}>{restaurant?.name}</Text>
            <Text style={styles.title}>Your items</Text>
            <FlatList data={basketDishes} renderItem={({item}) => <BasketDishItem basketDish={item}/>}/>
            <View style={styles.separator}/>
            <Pressable onPress={onCreateOrder} style={styles.button}>
                <Text style={styles.buttonText}>Create order &#8226; $ {totalPrice.toFixed(2)}</Text>
            </Pressable>
        </View>
    )
};

export default Basket;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        width: '100%',
        paddingVertical: 40,
        padding: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: "600",
        marginVertical: 10,
    },
    separator: {
        height: 1,
        backgroundColor: "lightgray",
        marginVertical: 10,
    },
    button: {
        backgroundColor: "black",
        marginTop: "auto",
        padding: 20,
        alignItems: "center"
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 20,
    },

    title: {
        fontWeight: "bold",
        marginTop: 20,
        fontSize: 19
    },

})

