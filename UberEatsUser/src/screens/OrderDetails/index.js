import {ActivityIndicator, FlatList, Text} from "react-native";
import BasketDishItem from "../../components/BasketDishItem";
import {useOrderContext} from "../../contexts/OrderContext";
import {useEffect, useState} from "react";
import {useRoute} from "@react-navigation/native";
import Header from "./Header";
import {DataStore} from "aws-amplify";
import {Order} from "../../models";


const OrderDetails = () => {

    const [order, setOrder] = useState({})
    const {orderDishes} = useOrderContext()
    const route = useRoute();
    const id = route.params?.id;

    useEffect(() => {
        DataStore.query(Order,id).then(setOrder)
    }, [id])

    if (!order) {
        return <ActivityIndicator size={"large"} color="gray"/>
    }

    return (
        <>
            {orderDishes?.[0] &&
                <FlatList
                    ListHeaderComponent={() => <Header order={order}/>}
                    data={orderDishes}
                    renderItem={({item}) => <BasketDishItem dish={item}/>}
                />
            }
            <Text>
                total order price : {order?.totalPrice} $
            </Text>

        </>

    )
}

export default OrderDetails;
