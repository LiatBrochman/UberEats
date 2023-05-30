import React from "react"
import {Text, View} from "react-native";
import styles from "./styles";
import CachedImage from 'expo-cached-image';

const RestaurantHeader = React.memo(({restaurant}) => {

    return (
        <View style={styles.page}>
            {restaurant?.image &&
            <CachedImage
                source={{uri: restaurant.image}}
                cacheKey={restaurant.id}
                style={styles.image}
            />}

            <View style={styles.container}>
                <Text>{restaurant.address}</Text>
                <Text style={styles.title}>{restaurant.name}</Text>
                <Text
                    style={styles.subtitle}>${restaurant.deliveryFee.toFixed(1)} &#8226; {restaurant.minDeliveryMinutes}-
                    {restaurant.maxDeliveryMinutes} minutes
                </Text>

                <Text style={styles.menuTitle}>Menu</Text>
            </View>

        </View>
    );
});

export default RestaurantHeader;
