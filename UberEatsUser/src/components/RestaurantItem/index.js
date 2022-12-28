import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {useRestaurantContext} from "../../contexts/RestaurantContext";


const RestaurantItem = ({restaurant}) => {
    const navigation = useNavigation()
    const {setRestaurant} = useRestaurantContext()


    const onPress = () => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ restaurant was pressed ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(restaurant,null,4))
        setRestaurant(restaurant)
        navigation.navigate("Restaurant", { id: restaurant?.id });
    };
    return (
        <Pressable onPress={onPress}  style={styles.restaurantContainer}>
            <Image
                source={{uri: restaurant?.image}}
                   style={styles.image}/>
            <View style={styles.row}>
            <View>
            <Text style={styles.title}>{restaurant?.name}</Text>
            <Text style={styles.subtitle}>
                ${restaurant?.deliveryFee?.toFixed(1)} &#8226;{" "}
                {restaurant?.minDeliveryMinutes}-{restaurant?.maxDeliveryMinutes} minutes</Text>
            </View>
                <View style={styles.rating}>
                    <Text>{restaurant?.rating.toFixed(1)}</Text>
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
    },
    subtitle: {
        color: "grey",
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        marginLeft: 'auto',
        backgroundColor: 'lightgrey',
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
    },
});
