import React, {useEffect, useMemo} from 'react';
import BottomSheet from "@gorhom/bottom-sheet";
import {Text, View} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import {useCourierContext} from "../../contexts/CourierContext";
import {useOrderContext} from "../../contexts/OrderContext";
import Tester from "../Tester";

const MapBottomSheet = ({order}) => {
    const snapPoints = useMemo(() => ["12%", "95%"], [])
    const {ETAs, countETAs} = useCourierContext()
    const {liveOrders, getStageByStatus} = useOrderContext()

    useEffect(() => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ ETAs ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(ETAs, null, 4))
    }, [countETAs]);


    return (
        <BottomSheet isVisible={true} snapPoints={snapPoints}>
            {liveOrders.length > 0 && liveOrders.map((liveOrder, index) => {

                    const stage = getStageByStatus(liveOrder.status)

                    return <View key={index} style={{height: 500, marginLeft: 30, marginBottom: 30}}>
                        <Text style={{letterSpacing: 0.5, color: 'gray'}}>
                            DELIVERY TIME
                        </Text>
                        {liveOrder.status !== "NEW" && ETAs.length > 0 &&
                        <View style={{flexDirection: "row", paddingTop: 10}}>
                            <AntDesign
                                name="clockcircle"
                                size={20}
                                color={"gray"}
                                style={{marginRight: 10, alignSelf: "center"}}
                            />
                            <Text style={{
                                fontSize: 20, fontWeight: '600', letterSpacing: 0.5
                            }}>{ETAs.find(ETA => ETA.courierID === liveOrder.courierID)?.time} minutes</Text>
                        </View>}
                        <View style={{flexDirection: "row", paddingTop: 10}}>
                            <AntDesign
                                name={stage >= 1 ? "checkcircle" : "minuscircle"}
                                size={25}
                                color={stage >= 1 ? "#96CEB4" : "#FFAD60"}
                                style={{marginRight: 10, alignSelf: "center"}}
                            />
                            <View>
                                <Text style={{letterSpacing: 0.5, fontWeight: '600'}}>
                                    Order confirmed
                                </Text>
                                <Text style={{letterSpacing: 0.5, color: 'gray'}}>
                                    Your order has been received
                                </Text>

                            </View>

                        </View>
                        <View style={{
                            borderWidth: 0.5,
                            borderColor: 'lightgray',
                            marginTop: 10,
                            width: "90%"
                        }}></View>
                        <View style={{flexDirection: "row", paddingTop: 20}}>
                            <AntDesign
                                name={stage >= 2 ? "checkcircle" : "minuscircle"}
                                size={25}
                                color={stage >= 2 ? "#96CEB4" : "#FFAD60"}
                                style={{marginRight: 10, alignSelf: "center"}}
                            />
                            <View>
                                <Text style={{letterSpacing: 0.5, fontWeight: '600'}}>
                                    Order prepared
                                </Text>
                                <Text style={{letterSpacing: 0.5, color: 'gray'}}>
                                    Your order has been prepared
                                </Text>

                            </View>

                        </View>
                        <View style={{
                            borderWidth: 0.5,
                            borderColor: 'lightgray',
                            marginTop: 10,
                            width: "90%"
                        }}></View>
                        <View style={{flexDirection: "row", paddingTop: 20}}>
                            <AntDesign
                                name={stage === 3 ? "checkcircle" : "minuscircle"}
                                size={25}
                                color={stage === 3 ? "#96CEB4" : "#FFAD60"}
                                style={{marginRight: 10, alignSelf: "center"}}
                            />
                            <View>
                                <Text style={{letterSpacing: 0.5, fontWeight: '600'}}>
                                    Delivery in progress
                                </Text>
                                <Text style={{letterSpacing: 0.5, color: 'gray'}}>
                                    Hang on! Your food is on the way.
                                </Text>

                            </View>

                        </View>
                        <View style={{
                            borderWidth: 0.5,
                            borderColor: 'lightgray',
                            marginTop: 10,
                            width: "90%"
                        }}></View>
                    </View>
                }
            )}
           <Tester order={order}/>

        </BottomSheet>
    );
}

export default MapBottomSheet;