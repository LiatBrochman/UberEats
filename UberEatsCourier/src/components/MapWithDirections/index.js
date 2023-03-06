import React from 'react';
import {View} from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import {useDirectionContext} from '../../contexts/DirectionContext';
import {useCourierContext} from "../../contexts/CourierContext";
import {useOrderContext} from "../../contexts/OrderContext";

/**The Directions component is created to encapsulate the logic for rendering the MapViewDirections component with the given origin, destination, and API key props.
 It's a reusable and generic component that can be used in multiple places throughout the app.

 The MapWithDirections component is a higher-order component that is created to wrap the Directions component in a View container.
 It's created to provide additional flexibility and abstraction to the app, allowing it to be used as a standalone component that can be easily integrated into any part of the app.

 By separating the logic into two separate components, it brings several benefits:

 1. Reusability: The Directions component can be reused in multiple places throughout the app, reducing code duplication and improving maintainability.

 2. Abstraction: The MapWithDirections component abstracts away the details of how the Directions component is rendered, making it easier to use and maintain.

 3. Flexibility: The MapWithDirections component provides additional flexibility by allowing you to wrap the Directions component in different containers or with different styles, depending on your specific use case.

 Overall, separating the logic into two separate components helps to improve the overall architecture of the app, making it more modular, reusable, and maintainable.
 */


const Directions = ({origin, destination, waypoints, apiKey}) => {
    const {dbCourier} = useCourierContext()
    const {onReady} = useDirectionContext()

    return (
        <MapViewDirections
            mode={dbCourier.transportationMode}
            origin={origin}
            destination={destination}
            waypoints={waypoints}
            apikey={apiKey}
            strokeWidth={10}
            strokeColor="#96CEB4"
            onReady={onReady}
        />
    )
}

const MapWithDirections = () => {
    const {origin, waypoints, destination, tempOrigin, tempWaypoints, tempDestination, apiKey} = useDirectionContext()
    const {liveOrder, pressedOrder} = useOrderContext()


    // if (!liveOrder || !pressedOrder) {
    //     return (<></>)
    // }

    return (
        <View>
            {(liveOrder || pressedOrder) &&

            <Directions
                origin={origin || tempOrigin}
                destination={destination || tempDestination}
                waypoints={waypoints || tempWaypoints}
                apiKey={apiKey}/>

            }
        </View>
    )
}

export default MapWithDirections

