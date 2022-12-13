import {useRestaurantContext} from "../../contexts/RestaurantContext";
import {Image, Text, View} from "react-native";
import styles from "./styles";

const Header = ({order}) => {
    const {restaurant} = useRestaurantContext()
    return (
        <View>
            <View style={styles.page}>
                <Image
                    source={{uri: restaurant?.image}}
                    style={styles.image}
                />

                <View style={styles.container}>
                    <Text style={styles.title}>{restaurant?.name}</Text>
                    <Text style={styles.subtitle}>{order.status} &#8226; 2 days ago</Text>
                    <Text style={styles.menuTitle}>Your orders</Text>
                </View>

            </View>
        </View>
    );
};
export default Header;
