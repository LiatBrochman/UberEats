import {useRestaurantContext} from "../../contexts/RestaurantContext";
import {Text, View} from "react-native";
import styles from "./styles";
import CachedImage from 'expo-cached-image';

const getDaysAgo = ({order}) => {
    if (order && order?.createdAt) {
        let date = (new Date(order.createdAt)).getTime()
        let now = (new Date()).getTime()
        return ((now - date) / 86400000).toFixed(0)
    }
}

const Header = ({order}) => {
    const {restaurant} = useRestaurantContext()
    return (
        <View>
            <View style={styles.page}>
                {restaurant?.image &&
                <CachedImage
                    source={{uri: restaurant.image}}
                    cacheKey={restaurant.image.substring(restaurant.image.lastIndexOf('/') + 1)}
                    style={styles.image}
                />}

                <View style={styles.container}>
                    <Text style={styles.title}>{restaurant?.name}</Text>
                    <Text style={styles.subtitle}>
                        &#8226;{order.status}&#8226; {getDaysAgo({order})} days ago
                    </Text>
                    <Text style={styles.menuTitle}>Your orders</Text>
                </View>

            </View>
        </View>
    );
};
export default Header;
