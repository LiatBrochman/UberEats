import React, {useEffect, useMemo, useState} from 'react';
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
    const {dbCourier} = useCourierContext();
    const {onReady} = useDirectionContext();

    // Memoize the props so they are only recalculated when necessary
    const memoizedOrigin = useMemo(() => origin, [origin]);
    const memoizedDestination = useMemo(() => destination, [destination]);
    const memoizedWaypoints = useMemo(() => waypoints, [waypoints]);

    useEffect(() => {

        console.log(
            '\n\n222222222@@@@@@@@@@ origin:',
            memoizedOrigin,
            '\n222222222@@@@@@@@@@ destination:',
            memoizedDestination,
            '\n222222222@@@@@@@@@@ waypoints:',
            memoizedWaypoints,
        );

    }, [memoizedOrigin,
        memoizedDestination,
        memoizedWaypoints]);


    return (
        <MapViewDirections
            mode={dbCourier.transportationMode}
            origin={memoizedOrigin}
            destination={memoizedDestination}
            waypoints={memoizedWaypoints}
            apikey={apiKey}
            strokeWidth={10}
            strokeColor="#96CEB4"
            onReady={onReady}
            onError={(error) =>
                console.error('An error occurred while getting directions:', error)
            }
        />
    );
};

export const MyDirections = () => {
    const {origin, waypoints, destination, apiKey} = useDirectionContext({waypoints: []})
    const {liveOrder, pressedOrder} = useOrderContext()
    const [prevDirection, setPrevDirection] = useState({origin: null, waypoints: [], destination: null})
    const [needToRenderMap, setNeedToRenderMap] = useState(false)

    useEffect(() => {

        if (liveOrder || pressedOrder && origin && destination) {

            if (prevDirection.origin === origin && prevDirection.destination === destination && waypoints?.[0] === prevDirection.waypoints?.[0]) {
                setNeedToRenderMap(false)
                console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ no need to re-render (same map values) ~~~~~~~~~~~~~~~~~~~~~ :")

            } else {
                setPrevDirection({origin, destination, waypoints: [...waypoints]})
                setNeedToRenderMap(true)
                console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ about to re-render (updated values) ~~~~~~~~~~~~~~~~~~~~~ :")

            }


        }

    }, [origin, waypoints, destination])

    return (<View>
            {needToRenderMap &&

            <Directions
                origin={origin}
                destination={destination}
                waypoints={waypoints}
                apiKey={apiKey}/>
            }
        </View>
    )

}
// const MapWithDirections = () => {
//     const {origin, waypoints, destination, tempWaypoints, tempDestination, apiKey} = useDirectionContext()
//     const {liveOrder, pressedOrder} = useOrderContext()
//
//     const [currentDirection, setCurrentDirection] = useState({
//         origin: null,
//         waypoints: null,
//         destination: null,
//         tempOrigin: null,
//         tempWaypoints: null,
//         tempDestination: null
//     })
//     useEffect(() => {
//         origin && console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ origin ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(origin, null, 4))
//         tempWaypoints?.length && console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ tempWaypoints ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(tempWaypoints, null, 4))
//         tempDestination && console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ tempDestination ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(tempDestination, null, 4))
//
//         if(liveOrder){
//             setCurrentDirection(prev => Object.assign(prev, {
//                 origin,
//                 waypoints,
//                 destination
//             }))
//         }
//         if(pressedOrder)
//         setCurrentDirection(prev => Object.assign(prev, {
//             origin,
//             tempWaypoints,
//             tempDestination
//         }))
//
//     }, [tempWaypoints, tempDestination])
//
//     return (<View>
//             {(liveOrder || pressedOrder) && origin &&
//
//             <Directions
//                 origin={origin}
//                 destination={currentDirection.destination || currentDirection.tempDestination || origin}
//                 waypoints={currentDirection.waypoints || currentDirection.tempWaypoints || []}
//                 apiKey={apiKey}/>
//
//             }
//         </View>
//     )
// }
//
// export default MapWithDirections
