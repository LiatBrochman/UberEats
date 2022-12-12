import {View, Text, Image, FlatList, ActivityIndicator} from "react-native";
import BasketDishItem from "../../components/BasketDishItem";
import styles from "./styles";
import {useOrderContext} from "../../contexts/OrderContext";
import {useEffect, useState} from "react";
import {useRoute} from "@react-navigation/native";
import {useBasketContext} from "../../contexts/BasketContext";


const OrderDetailsHeader = ({order}) => {
    // const route = useRoute()
    // const id = route.params?.id
    // const {getRestaurant} = useBasketContext()
    // const [restaurant, setRestaurant] = useState()

    // useEffect(() => {
    //     if (id) {
    //         getRestaurant(id).then(setRestaurant)
    //     }
    // }, [id])

    const {restaurant} = useBasketContext()
    return (
        <View>
            <View style={styles.page}>
                <Image
                    source={{uri: restaurant?.image}}
                    style={styles.image}
                />

                <View style={styles.container}>
                    <Text style={styles.title}>{restaurant?.name}</Text>
                    <Text style={styles.subtitle}>{order.status} &#8226; 2 days ago</Text>
                    <Text style={styles.menuTitle}>Your orders</Text>
                </View>

            </View>
        </View>
    );
};

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
            ListHeaderComponent={() => <OrderDetailsHeader order={order}/>}
            data={order.dishes}
            renderItem={({item}) => <BasketDishItem basketDish={item}/>}
        />
    );
};

export default OrderDetails;
