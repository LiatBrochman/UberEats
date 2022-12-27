import { StyleSheet, View, Text, FlatList } from "react-native";
import OrderListItem from "../../components/OrderListItem";
import {useOrderContext} from "../../contexts/OrderContext";
import {getRestaurant_ByOrder,getDishes_ByOrder} from "../../contexts/Queries";
import {useEffect, useState} from "react";

const OrderScreen = () => {
    const { orders } = useOrderContext()
    // const [theArr,setTheArr] = useState([])
    // useEffect(()=>{
    //      const result = orders.map(async order=>{
    //             order?.restaurant= await getRestaurant_ByOrder({order})
    //             order.quantity=()=>{
    //                 let count=0
    //                 orders.forEach(async order=> {
    //                     const dish= await getDishes_ByOrder({order})
    //                     count+= dish.quantity
    //                 })
    //                 return count
    //             }
    //             return order
    //         })
    //     setTheArr(result)
    // },[orders])

    return (
    <View style={styles.container}>
            <FlatList
                data={orders}
                renderItem={({item}) => <OrderListItem order={item.hasOwnProperty('_z') ? item['_z'] : item} />}
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
