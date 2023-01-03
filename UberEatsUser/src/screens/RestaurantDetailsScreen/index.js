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
import {useRoute, useNavigation} from "@react-navigation/native";
import {DataStore} from "aws-amplify";
import {Restaurant, Dish} from "../../models";
import {useBasketContext} from "../../contexts/BasketContext";
import {useRestaurantContext} from "../../contexts/RestaurantContext";
import {getRestaurantDishes} from "../../contexts/Queries";
import {useDishContext} from "../../contexts/DishContext";

const RestaurantDetailsScreen = () => {
    const navigation = useNavigation()
    const {restaurant} = useRestaurantContext()
    const {basket} = useBasketContext()
    const {restaurantDishes,basketDishes} = useDishContext()
   // const itemsInBasket = ()=>basketDishes && basketDishes.reduce((count,dish)=>count+dish?.quantity,0)
    // const itemsInBasket = ()=>basketDishes.sum(dish=>dish.quantity,0)

    const [items,setItems]=useState(0)

    useEffect(()=>{
    console.log("\n\n !@#$%!@#!$@#!!@!##!!#$$@@!#@@#!# basketDishes from RestaurantDetailsScreen !@#$%!@#!$@#!!@!##!!#$$@@!#@@#!# :", JSON.stringify(basketDishes,null,4))

        basketDishes &&
        setItems(basketDishes.reduce((count,dish)=>count+dish.quantity,0))
    },[basketDishes])

    if (!restaurant || !basket ) {
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

            <Pressable onPress={() => navigation.navigate("Basket")} style={styles.button}
                       disabled={!items}>
                <Text style={styles.buttonText}>Open basket({items})</Text>
            </Pressable>


        </View>
    );
};


export default RestaurantDetailsScreen;
