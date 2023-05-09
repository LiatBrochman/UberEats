import {Image, Text, View} from "react-native";
import styles from "./styles";
import CachedImage from '../../myExternalLibrary/CachedImage';

const RestaurantHeader = ({restaurant}) => {
    return (
        <View style={styles.page}>
            <CachedImage
                source={{uri: restaurant?.image}}
                style={styles.image}
            />

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
};

export default RestaurantHeader;
