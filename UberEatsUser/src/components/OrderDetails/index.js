import {FlatList, ActivityIndicator} from "react-native";
import BasketDishItem from "../BasketDishItem";
import {useOrderContext} from "../../contexts/OrderContext";
import {useEffect, useState} from "react";
import {useRoute} from "@react-navigation/native";
import Header from "./Header";
import OrderDishItem from "../OrderDishItem";


const OrderDetails = () => {
    const route = useRoute()
    const order = route.params?.order
    // const [order, setOrder] = useState();
    // const {orders , dishes} = useOrderContext();
    // const route = useRoute();
    // const id = route.params?.id;

    // useEffect(() => {
    //     getOrder_ByID({id}).then(setOrder);
    // }, []);

    if (!order) {
        console.error("order not found:",order)
        return <ActivityIndicator size={"large"} color="gray"/>;
    }

    return (
        <FlatList
            ListHeaderComponent={() => <Header order={order}/>}
            data={order?.dishes}
            renderItem={({item}) => <OrderDishItem dish={item}/>}
        />
    );
};

export default OrderDetails;
