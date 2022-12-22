import {FlatList, ActivityIndicator} from "react-native";
import BasketDishItem from "../../components/BasketDishItem";
import {useOrderContext} from "../../contexts/OrderContext";
import {useEffect, useState} from "react";
import {useRoute} from "@react-navigation/native";
import Header from "./Header";


const OrderDetails = () => {

    const [order, setOrder] = useState();
    const {getOrder} = useOrderContext();
    const route = useRoute();
    const id = route.params?.id;

    useEffect(() => {
        getOrder(id).then(setOrder);
    }, []);

    if (!order) {
        return <ActivityIndicator size={"large"} color="gray"/>;
    }

    return (
        <FlatList
            ListHeaderComponent={() => <Header order={order}/>}
            data={order?.dishes ?? []}
            renderItem={({item}) => <BasketDishItem basketDish={item}/>}
        />
    );
};

export default OrderDetails;
