import {
    View,
    FlatList,
    ActivityIndicator,
    Pressable,
    Text,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import DishListItem from "../../components/DishListItem";
import Header from "./Header";
import styles from "./styles";
import { useNavigation} from "@react-navigation/native";
import {useBasketContext} from "../../contexts/BasketContext";
import {useRestaurantContext} from "../../contexts/RestaurantContext";

const RestaurantDetailsPage = () => {

    const navigation = useNavigation()
    const {restaurant, restaurantDishes} = useRestaurantContext()
    const {basket, totalBasketQuantity} = useBasketContext()


    if (!restaurant) {
        return <ActivityIndicator size={"large"} color="gray"/>
    }

    return (
        <View style={styles.page}>
            <FlatList
                ListHeaderComponent={() => <Header restaurant={restaurant}/>}
                data={restaurantDishes}
                renderItem={({item}) => <DishListItem dish={item}/>}
                keyExtractor={(item) => item.name}
            />
            <Ionicons onPress={() => navigation.goBack()} name="arrow-back-circle" size={45} color="white"
                      style={styles.iconContainer}/>

            {basket && (
                <Pressable onPress={() => navigation.navigate("Basket")} style={styles.button}>
                    <Text style={styles.buttonText}>Open basket({totalBasketQuantity})</Text>
                </Pressable>
            )}
        </View>
    );
};


export default RestaurantDetailsPage;
