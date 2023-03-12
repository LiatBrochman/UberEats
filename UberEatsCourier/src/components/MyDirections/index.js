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


const Directions = ({destination, waypoints, apiKey}) => {
    const {dbCourier,} = useCourierContext();
    const {onReady, origin} = useDirectionContext();

    // Memoize the props so they are only recalculated when necessary
    const memoizedOrigin = useMemo(() => origin, [origin]);
    const memoizedDestination = useMemo(() => destination, [destination]);
    const memoizedWaypoints = useMemo(() => waypoints, [waypoints]);
    const [forceReRender, setForceReRender] = useState(0);

    useEffect(() => {
        console.log(
            '\n\n@@@@@@@@@@ origin:',
            memoizedOrigin,
            '\n@@@@@@@@@@ destination:',
            memoizedDestination,
            '\n@@@@@@@@@@ waypoints:',
            memoizedWaypoints,
        )

    }, [memoizedOrigin,
        memoizedDestination,
        memoizedWaypoints])


    const handleDirectionsError = (error) => {
        console.error("\n\n ~~~~~~~~~~~~~~~~~~~~~ trying to re render map because of error: ~~~~~~~~~~~~~~~~~~~~~ :", error)
        setForceReRender(x => x + 1)
    }
    return (
        <MapViewDirections
            key={forceReRender}
            mode={dbCourier.transportationMode}
            origin={memoizedOrigin}
            destination={memoizedDestination}
            waypoints={memoizedWaypoints}
            apikey={apiKey}
            strokeWidth={10}
            strokeColor="#96CEB4"
            onReady={onReady}
            onError={handleDirectionsError}
        />
    )
}

export const MyDirections = () => {
    const {origin, waypoints, destination, isRendered, apiKey} = useDirectionContext({waypoints: [], isRendered: true})
    const {liveOrder, pressedOrder} = useOrderContext()
    const [prevDirection, setPrevDirection] = useState({origin: null, waypoints: [], destination: null})
    const [needToRenderMap, setNeedToRenderMap] = useState(false)

    useEffect(() => {

        if (liveOrder || pressedOrder && origin && destination) {


            if (!isRendered) {
                setNeedToRenderMap(true)
                console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ about to render (First Render) ~~~~~~~~~~~~~~~~~~~~~ ")
                return
            }

            if (prevDirection.origin === origin && prevDirection.destination === destination && waypoints?.[0] === prevDirection.waypoints?.[0]) {
                setNeedToRenderMap(false)
                console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ no need to re-render (same map values) ~~~~~~~~~~~~~~~~~~~~~ ")

            } else {
                setPrevDirection({origin, destination, waypoints: [...waypoints]})
                setNeedToRenderMap(true)
                console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ about to re-render (updated values) ~~~~~~~~~~~~~~~~~~~~~ ")

            }


        }

    }, [origin, waypoints, destination, isRendered])

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


export const MyDirections_fixed = () => {
    const {dbCourier} = useCourierContext()
    const {origin, onReady, waypoints, destination, wrongOrigin, apiKey} = useDirectionContext({waypoints: []})
    const {liveOrder, pressedOrder} = useOrderContext()
    const [forceReRender, setForceReRender] = useState(0)
    // const [needToRenderMap, setNeedToRenderMap] = useState(false)
    // const memoizedOrigin = useMemo(() => origin, [origin])
    // const memoizedDestination = useMemo(() => destination, [destination])
    // const memoizedWaypoints = useMemo(() => waypoints, [waypoints])
    // useEffect(() => {
    //
    //     if (liveOrder || pressedOrder && origin && destination) {
    //
    //         if (isRendered === "beforeRender" || isRendered === false) {
    //             setNeedToRenderMap(true)
    //             console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ about to render (First Render) ~~~~~~~~~~~~~~~~~~~~~ ")
    //
    //         // } else if ( !== origin) {
    //         //     setNeedToRenderMap(true)
    //         //     console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ about to re-render (location changed) ~~~~~~~~~~~~~~~~~~~~~ ")
    //         //     setForceReRender(x => x + 1)
    //
    //         } else {
    //             setNeedToRenderMap(false)
    //         }
    //     }
    // }, [isRendered, liveOrder, pressedOrder, origin, destination])

    const handleDirectionsError = (error) => {
        console.error("\n\n ~~~~~~~~~~~~~~~~~~~~~ trying to re render map because of error: ~~~~~~~~~~~~~~~~~~~~~ :", error)
        setTimeout(() => {
            setForceReRender(x => x + 1)
        }, 1000)
    }

    useEffect(() => {

        if(wrongOrigin){
            setTimeout(() => {
                console.log("\n\n !!!!!!!!!!!!!! wrongOrigin ~~~~~~~~~~~~~~~~~~~~~ ", wrongOrigin, forceReRender)
                setForceReRender(x => x + 1)
            }, 1000)
        }

    }, [wrongOrigin,forceReRender])

    return (<View>
            {
                (liveOrder || pressedOrder) && origin && destination &&
                <MapViewDirections
                    key={forceReRender}
                    mode={dbCourier.transportationMode}
                    origin={origin}
                    destination={destination}
                    waypoints={waypoints}
                    apikey={apiKey}
                    strokeWidth={10}
                    strokeColor="#96CEB4"
                    onReady={async (result) => await onReady(result)}
                    onError={handleDirectionsError}
                />

            }
        </View>
    )

}