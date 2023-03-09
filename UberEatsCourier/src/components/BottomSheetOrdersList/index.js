import React, {useMemo, useRef} from 'react';
import {Text, View} from 'react-native';
import BottomSheet, {BottomSheetFlatList} from "@gorhom/bottom-sheet";
import OrderItem from "../OrderItem";
import {useOrderContext} from "../../contexts/OrderContext";


export const BottomSheetOrdersList = () => {
    const bottomSheetRef = useRef(null)
    const snapPoints = useMemo(() => ["12%", "95%"], [])
    const {ordersToCollect} = useOrderContext({ordersToCollect: []})


    return (
        <BottomSheet isVisible={true} ref={bottomSheetRef} snapPoints={snapPoints}>
            <View style={{alignItems: 'center', marginBottom: 30}}>
                <Text style={{
                    fontSize: 20, fontWeight: '600', letterSpacing: 0.5, paddingBottom: 5
                }}>You're Online</Text>
                <Text style={{letterSpacing: 0.5, color: '#D9534F', fontWeight: '600'}}>
                    Available Orders: {ordersToCollect.length}
                </Text>

            </View>
            <BottomSheetFlatList
                data={ordersToCollect}
                renderItem={({item}) => {

                    return <OrderItem
                        order={item}
                    />
                }}
            />
        </BottomSheet>
    )
};

