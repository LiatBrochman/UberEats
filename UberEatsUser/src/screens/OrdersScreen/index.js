import {FlatList, StyleSheet, View} from "react-native";
import OrderListItem from "../../components/OrderListItem";
import {useOrderContext} from "../../contexts/OrderContext";

const OrderScreen = () => {
    const { orders } = useOrderContext();

    return (
    <View style={styles.container}>
        <FlatList
        data={orders}
        renderItem={({item}) => <OrderListItem order={item} />}
        />
    </View>
    );
};

export default OrderScreen;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        width: "100%",
    },
});
