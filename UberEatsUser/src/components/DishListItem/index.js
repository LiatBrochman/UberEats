import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {useBasketContext} from "../../contexts/BasketContext";
import CachedImage from '../../myExternalLibrary/CachedImage';


const DishListItem = ({dish}) => {
    const navigation = useNavigation()
    const {setDish} = useBasketContext()
    return (
        <Pressable
            onPress={() => {
                setDish(dish)
                // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ setDish(dish) ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(dish, null, 4))
                navigation.navigate("Dish", {id: dish.id})
            }}
            style={styles.container}>
            {dish.image && (<CachedImage source={{uri: dish.image}} style={styles.image}/>)}
            <View style={{flex: 1, marginLeft: 10}}>
                <Text style={styles.name}>{dish.name}</Text>
                <Text style={styles.description} numberOfLines={2}>{dish.description}</Text>
                <Text style={styles.price}>${dish.price}</Text>
            </View>

        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: 10,
        marginVertical: 10,
        marginHorizontal: 20,
        borderBottomColor: 'lightgray',
        borderBottomWidth: 1,
        flexDirection: "row",
    },
    name: {
        fontWeight: '600',
        fontSize: 16,
        letterSpacing: 0.5,
    },
    description: {
        color: '#2a2a2a',
        marginVertical: 5,
    },
    price: {
        // fontSize: 16,
        fontWeight: '600',
        color: "black"
    },
    image: {
        height: 75,
        aspectRatio: 1,
        borderRadius: 10,
    },
});
export default DishListItem;
