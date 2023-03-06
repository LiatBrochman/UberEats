import React from 'react';
import {Marker} from "react-native-maps";
import {Entypo} from "@expo/vector-icons";
import {View} from "react-native";

function RestaurantMarker({order, restaurant, key = null}) {
console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ restaurant ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(restaurant,null,4))

    return (
        <Marker
            key={key || restaurant?.id}
            title={restaurant?.name}
            description={order?.restaurantLocation?.address}
            coordinate={{
                latitude: order?.restaurantLocation?.lat,
                longitude: order?.restaurantLocation?.lng
            }}>
            <View style={{
                backgroundColor: 'white',
                padding: 5,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: '#FFAD60'
            }}>
                <Entypo name="shop" size={24} color="#FFAD60"/>
            </View>
        </Marker>
    );
}

export default RestaurantMarker;