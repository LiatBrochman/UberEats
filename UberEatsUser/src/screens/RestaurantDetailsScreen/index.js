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
import {Amplify, DataStore} from "aws-amplify";
import {Restaurant, Dish} from "../../models";
import {useBasketContext} from "../../contexts/BasketContext";
import {useRestaurantContext} from "../../contexts/RestaurantContext";

const RestaurantDetailsPage = () => {
    // const [restaurant, setRestaurant] = useState();
    // const [dishes, setDishes] = useState();
    const route = useRoute()
    const navigation = useNavigation()
    const {getRestaurant_ByID, setRestaurant,restaurant, restaurantDishes} = useRestaurantContext()
    const {basket,basketDishes, totalBasketQuantity} = useBasketContext()

    // useEffect(()=>{
    //     route.params?.restaurant && setRestaurant(route.params?.restaurant)
    // },[route.params?.restaurant])

    // const [itemsInBasket, setItemsInBasket] = useState(totalBasketQuantity)
    // const id = route.params?.id

    // setRestaurant(route.params?.restaurant)
    // useEffect(() => {
    //     if (id) {
    //         // fetch the restaurant with the id
    //         getRestaurant_ByID(id).then(setRestaurant)
    //         // DataStore.query(Dish, dish => dish.restaurantID.eq(id)).then(setDishes)
    //     }
    // }, [id])

    // useEffect(() => {//this re-renders the amount of dishes that belongs to the current customer (bottom of restaurant screen)
    //
    //     basket?.id && basketDishes?.length &&
    //     setItemsInBasket(basketDishes.reduce((count, dish) => count + dish.quantity, 0))
    //
    //     // Amplify.DataStore.observeQuery(Dish, d =>  d.and(d=>[
    //     //     d.basketID.eq(basket.id),
    //     //     d.isDeleted.eq(false)
    //     // ])).subscribe(dishes => {
    //     //     console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ @@@@ observeQuery @@@@ ~~~~~~~~~~~~~~~~~~~~~ dishes quantity :", JSON.stringify(dishes?.quantity,null,4))
    //     //     dishes?.items?.length && setItemsInBasket(dishes.items.reduce((count,dish)=>count+dish.quantity,0))
    //     //
    //     // })
    //     //--todo : dont delete:
    //     // basketDishes?.length > 0 &&
    //     // setItemsInBasket(basketDishes.reduce((count,dish)=>count+dish.quantity,0))
    //     // },[basketDishes])
    // }, [basketDishes])
    //
    // useEffect(()=>{
    //     setItemsInBasket(old=>old+1)
    //     setItemsInBasket(old=>old-1)
    //     console.log("updated items amount:",itemsInBasket)
    // },[itemsInBasket])

    // useEffect(() => {
    //     setRestaurant(restaurant);
    // }, [restaurant]);


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
