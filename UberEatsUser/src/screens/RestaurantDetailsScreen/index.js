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
    const { basket,  dishes:basketDishes } = useBasketContext()

    const [itemsInBasket,setItemsInBasket] = useState(0)

    const id = route.params?.id

    useEffect(() => {
        if(id) {
            // fetch the restaurant with the id
            getRestaurant_ByID(id).then(setRestaurant)
            // DataStore.query(Dish, dish => dish.restaurantID.eq(id)).then(setDishes)
        }
    }, [id])

    useEffect(()=>{
        basketDishes?.length > 0 &&
        setItemsInBasket(basketDishes.reduce((count,dish)=>count+dish.quantity,0))
    },[basketDishes])

    // useEffect(() => {
    //     setRestaurant(restaurant);
    // }, [restaurant]);


    if (!restaurant) {
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
            <Pressable onPress={() => navigation.navigate("Basket")} style={styles.button}>
                <Text style={styles.buttonText}>Open basket({itemsInBasket})</Text>
            </Pressable>
            )}
        </View>
    );
};


export default RestaurantDetailsPage;
