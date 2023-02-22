import {Image, Pressable, StyleSheet, Text, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {useRestaurantContext} from "../../contexts/RestaurantContext";
import {AntDesign} from "@expo/vector-icons";
import {useBasketContext} from "../../contexts/BasketContext";

const DEFAULT_IMAGE =
    "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/uber-eats/restaurant1.jpeg";


const RestaurantItem = ({restaurant}) => {
    const navigation = useNavigation()
    const {setRestaurant} = useRestaurantContext()
    const {findExistingBasket , setBasket} = useBasketContext()

    const onPress = async () => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ onPress---> restaurant ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(restaurant,null,4))

        setRestaurant(restaurant)
        setBasket(findExistingBasket(restaurant.id))
        navigation.navigate("Restaurant", {id: restaurant?.id});
    }
    return (
        <Pressable onPress={onPress} style={styles.restaurantContainer}>
            <Image
                source={{uri:  restaurant?.image}}
                style={styles.image}/>
            <View style={styles.deliveryTime}>
                <Text
                    style={{color: "black"}}>{restaurant?.minDeliveryMinutes}-{restaurant?.maxDeliveryMinutes} min</Text>
            </View>
            <View style={styles.row}>
                <View>
                    <Text style={styles.title}>{restaurant?.name}</Text>
                    <Text style={styles.subtitle}>
                        $ {restaurant?.deliveryFee.toFixed(1)} &#8226;{" "}
                        <AntDesign
                            name="star"
                            size={15}
                            color={"#96CEB4"}
                        />
                        <Text style={{fontWeight: "600", color: "black"}}> {restaurant?.rating?.toFixed(1)}</Text>
                    </Text>
                </View>

            </View>


        </Pressable>
    );
};

export default RestaurantItem;

const styles = StyleSheet.create({
    restaurantContainer: {
        width: '100%',
        marginVertical: 10,
    },
    image: {
        width: '100%',
        aspectRatio: 5 / 3,
        marginBottom: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: "500",
        marginVertical: 5,
        marginTop: 20,
    },
    subtitle: {
        color: "black",
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        // marginLeft: 'auto',
        // backgroundColor: 'lightgrey',
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',

        // borderRadius: 20,
    },
    deliveryTime: {
        marginRight: 10,
        display: "flex",
        marginTop: -50,
        backgroundColor: '#FFEEAD',
        width: 80,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        alignSelf: "flex-end"
    },
});
