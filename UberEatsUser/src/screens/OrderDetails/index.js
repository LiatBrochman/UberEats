import {ActivityIndicator, FlatList, Text, View} from "react-native";
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
        DataStore.query(Order, id).then(setOrder)
    }, [id])

    if (!order) {
        return <ActivityIndicator size={"large"} color="gray"/>
    }

    return (
        <View style={{backgroundColor: "white", flex: 1}}>

            {orderDishes?.[0] &&
            <FlatList
                ListHeaderComponent={() => <Header order={order}/>}
                data={orderDishes}
                renderItem={({item}) => <BasketDishItem dish={item}/>}
            />
            }

            <Text style={{padding: 10}}>
                total order price : {order?.totalPrice} $
            </Text>


        </View>

    )
}

export default OrderDetails;
