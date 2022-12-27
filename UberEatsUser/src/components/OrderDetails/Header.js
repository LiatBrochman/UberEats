import {useRestaurantContext} from "../../contexts/RestaurantContext";
import {Image, Text, View} from "react-native";
import styles from "./styles";
import {getDate, getTime} from "../../contexts/Queries";

const Header = ({order}) => {

    return (
        <View>
            <View style={styles.page}>
                <Image
                    source={{uri: order?.restaurant?.image}}
                    style={styles.image}
                />

                <View style={styles.container}>
                    <Text style={styles.title}>{order?.restaurant?.name}</Text>
                    <Text style={styles.subtitle}>{order?.status} &#8226; {getDate({order})} {getTime({order})}</Text>
                    <Text style={styles.menuTitle}>Your orders</Text>
                </View>

            </View>
        </View>
    );
};
export default Header;
