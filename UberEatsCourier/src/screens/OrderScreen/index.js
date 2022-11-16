import { useRef } from "react";
import { Text, View } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet'
import { GestureHandlerRootView , FlatList } from 'react-native-gesture-handler'
import orders from "../../../assets/data/orders.json"
import OrderItem from '../../components/OrderItem';

const OrderScreen = () => {
    const bottomSheetRef = useRef(null)
    return (
        <GestureHandlerRootView style={{flex: 1, backgroundColor:'lightblue'}}>
           <BottomSheet ref={bottomSheetRef} snapPoints={["12%","95%"]}>
               <View style={{alignItems: 'center', marginBottom:30}}>
                   <Text style={{fontSize: 20, fontWeight:'600', letterSpacing: 0.5, paddingBottom: 5
                   }}>You're Online</Text>
                   <Text style={{letterSpacing: 0.5, color:'gray'}}>Available Orders: {orders.length}</Text>
               </View>
               <FlatList
                   data={orders}
                   renderItem={({ item }) => <OrderItem order={item} />}
               />
           </BottomSheet>
        </GestureHandlerRootView>
    );
};

export default OrderScreen;
