import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useOrderContext} from "../../contexts/OrderContext";
import RestaurantMarker from "./RestaurantMarker";
import CustomerMarker from "./CustomerMarker";
import {DataStore} from "aws-amplify";
import {Restaurant} from "../../models";

export const FixedMarkers = () => {
    const {liveOrder, pressedOrder, ordersToCollect, pressedState} = useOrderContext({
        liveOrder: null,
        pressedOrder: null,
        ordersToCollect: []
    })
    const [rest_toCollect,setRest_toCollect]=useState([])

    useEffect(()=>{
        if(ordersToCollect.length===0) return

        DataStore.query(Restaurant, r => r.or(r =>
            ordersToCollect.map(o => r.id.eq(o.restaurantID))
        )).then(setRest_toCollect)

    },[ordersToCollect.length])

    if (liveOrder || pressedOrder) {

        return (<>
            <RestaurantMarker order={liveOrder || pressedOrder} restaurant={pressedState.restaurant}/>
            <CustomerMarker order={liveOrder || pressedOrder} customer={pressedState.customer}/>
        </>)

    } else {
        return (
            <View>
                {ordersToCollect.map( (order, index) => (
                    <RestaurantMarker
                        key={index}
                        order={order}
                        restaurant={rest_toCollect[index]}
                    />
                ))}

            </View>
        )
    }
}
// import React, {useState, useEffect} from 'react';
// import {View} from 'react-native';
// import {useOrderContext} from "../../contexts/OrderContext";
// import {DataStore} from "aws-amplify";
// import {Customer, Restaurant} from "../../models";
// import RestaurantMarker from "./RestaurantMarker";
//
// export const FixedMarkers = () => {
//     const {liveOrder} = useOrderContext();
//     const [restaurant, setRestaurant] = useState(null);
//
//     useEffect(() => {
//         if (liveOrder) {
//             DataStore.query(Restaurant, liveOrder.restaurantID).then((result) => {
//                 setRestaurant(result);
//                 console.log('restaurant:', result);
//             });
//         }
//     }, [liveOrder]);
//
//     if (liveOrder) {
//         return (
//             <View>
//                 <RestaurantMarker order={liveOrder} restaurant={restaurant} />
//             </View>
//         );
//     } else {
//         return null;
//     }
// };

