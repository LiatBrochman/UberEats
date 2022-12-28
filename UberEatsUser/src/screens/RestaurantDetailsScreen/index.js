import {useState, useEffect} from "react";
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
import { useRoute, useNavigation } from "@react-navigation/native";
import {DataStore} from "aws-amplify";
import { Restaurant, Dish } from "../../models";
import {useBasketContext} from "../../contexts/BasketContext";
import {useRestaurantContext} from "../../contexts/RestaurantContext";

const RestaurantDetailsPage = () => {
    // const [restaurant, setRestaurant] = useState();
    // const [dishes, setDishes] = useState();
    const route = useRoute()
    const navigation = useNavigation()
    const {getRestaurant_ByID, restaurant, setRestaurant, dishes } = useRestaurantContext()
    const {basket ,basketSize} = useBasketContext()
    const id = route.params?.id
    // useEffect(() => {
    //     if(id) {
    //         // fetch the restaurant with the id
    //
    //         getRestaurant_ByID({id}).then(setRestaurant)
    //
    //
    //
    //         // DataStore.query(Dish, dish => dish.restaurantID.eq(id)).then(setDishes)
    //     }
    // }, [id]);


    if (!restaurant && !(restaurant instanceof Restaurant)) {
        return <ActivityIndicator size={"large"} color="gray" />;
    }


    return (
         <View style={styles.page}>
            <FlatList
                ListHeaderComponent={() => <Header restaurant={restaurant}/>}
                data={dishes}
                renderItem={({item}) => <DishListItem dish={item}/>}
                keyExtractor={(item) => item.name}
            />
            <Ionicons onPress={() => navigation.goBack()} name="arrow-back-circle" size={45} color="white"
                      style={styles.iconContainer}/>

            { basket && (
            <Pressable onPress={() => navigation.navigate("Basket")} style={styles.button} disabled={typeof basketSize !=='number'}>
                <Text style={styles.buttonText}>Open basket({basketSize})</Text>
            </Pressable>
            )}
        </View>
    );
};


export default RestaurantDetailsPage;
