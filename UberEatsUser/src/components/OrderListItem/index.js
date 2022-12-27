import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation, useRoute} from "@react-navigation/native";
import {getDate, getTime} from "../../contexts/Queries"

const OrderListItem = ({order}) => {
    const navigation = useNavigation()

    return (
        <View>
            {console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ order ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(order,null,4))}
            <Pressable
                onPress={() => navigation.navigate("OrderDetails", {order:order})}
                style={styles.container}>
                <Image
                    source={{uri: order?.restaurant?.image }}
                    style={styles.image}
                />
                <View>
                    <Text style={styles.name}>{order?.restaurant?.name }</Text>
                    <Text style={styles.price}>{order?.quantity} items &#8226; ${order?.total}</Text>
                    <Text>{getDate({order})} {getTime({order})} &#8226; {order?.status}</Text>
                </View>
            </Pressable>

        </View>
    );
};

export default OrderListItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        margin: 10,
        alignItems: "center"
    },
    image: {
        width: 75,
        height: 75,
        marginRight: 5
    },
    name: {
        fontWeight: "600",
        fontSize: 16
    },
    price: {
        marginVertical: 5
    },
})
