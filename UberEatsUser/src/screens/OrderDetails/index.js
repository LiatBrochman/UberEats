import {FlatList, ActivityIndicator} from "react-native";
import BasketDishItem from "../../components/BasketDishItem";
import {useOrderContext} from "../../contexts/OrderContext";
import {useEffect, useState} from "react";
import {useRoute} from "@react-navigation/native";
import Header from "./Header";
import {getDishes_ByOrder} from "../../contexts/Queries";


const OrderDetails = () => {

    const [order, setOrder] = useState()
    const [dishes, setDishes] = useState()
    const {getOrder} = useOrderContext()
    const route = useRoute();
    const id = route.params?.id;

    useEffect(() => {
        getOrder(id).then(setOrder)
    }, [])

    useEffect(() => {

       if (order){
           console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~???????? order ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(order,null,4))

           getDishes_ByOrder({order}).then(setDishes)

        }
    }, [order])

    if (!order) {
        return <ActivityIndicator size={"large"} color="gray"/>
    }

    return (
        <>
            {dishes?.length &&
                <FlatList
                    ListHeaderComponent={() => <Header order={order}/>}
                    data={dishes}
                    renderItem={({item}) => <BasketDishItem dish={item}/>}
                />
            }
        </>

    )
}

export default OrderDetails;
