import {FlatList, StyleSheet, View} from "react-native";
import OrderListItem from "../../components/OrderListItem";
import {useOrderContext} from "../../contexts/OrderContext";

const OrderScreen = () => {
    const {liveOrders, completedOrders} = useOrderContext();

    return (
        <View style={styles.container}>
            <FlatList
                data={[...completedOrders,...liveOrders]}
                renderItem={({item}) => <OrderListItem order={item}/>}
            />
        </View>
    );
};

export default OrderScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: "white"
    },
});
