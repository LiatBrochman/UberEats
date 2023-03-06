import React from 'react';
import {View} from 'react-native';
import {useOrderContext} from "../../contexts/OrderContext";
import RestaurantMarker from "./RestaurantMarker";
import CustomerMarker from "./CustomerMarker";
import {DataStore} from "aws-amplify";
import {Restaurant} from "../../models";

export const FixedMarkers = () => {
    const {liveOrder, pressedOrder, ordersToCollect, restaurant, customer} = useOrderContext({
        liveOrder: null,
        pressedOrder: null,
        ordersToCollect: []
    })

    if (liveOrder || pressedOrder) {

        return (<View>
            <RestaurantMarker order={liveOrder || pressedOrder}  restaurant={restaurant}/>
            <CustomerMarker order={liveOrder || pressedOrder} customer={customer}/>
        </View>)

    } else {
        return (
            <View>
                {Promise.all(
                    ordersToCollect.map(async (order, index) => (
                        <RestaurantMarker
                            key={index}
                            order={order}
                            restaurant={await DataStore.query(Restaurant, order.restaurantID)}

                        />
                    ))
                )}
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

