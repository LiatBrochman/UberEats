import React from 'react';
import {Marker} from "react-native-maps";
import {MaterialIcons} from "@expo/vector-icons";
import {View} from "react-native";


function CustomerMarker({order,customer}) {

    return (
        <View>
                 <Marker
                    coordinate={{
                        latitude: order?.customerLocation?.lat,
                        longitude: order?.customerLocation?.lng
                    }}
                    title={customer?.name}
                    description={order?.customerLocation?.address}
                >
                    <View style={{
                        backgroundColor: 'white',
                        padding: 6,
                        borderRadius: 20,
                        borderWidth: 2,
                        borderColor: '#D9534F'
                    }}>
                        <MaterialIcons name="person" size={20} color="#D9534F"/>
                    </View>
                </Marker>
        </View>
    );
}

export default CustomerMarker;
//     <Marker
//         coordinate={{
//             latitude: order.customerLocation.lat,
//             longitude: order.customerLocation.lng
//         }}
//         title={customer?.name}
//         description={customer?.location.address}
//     >
//         <View style={{
//             backgroundColor: 'white',
//             padding: 6,
//             borderRadius: 20,
//             borderWidth: 2,
//             borderColor: '#D9534F'
//         }}>
//             <MaterialIcons name="person" size={20} color="#D9534F"/>
//         </View>
//     </Marker>