import {createContext, useContext, useEffect, useRef, useState} from "react";
import {useOrderContext} from "./OrderContext";
import * as Location from "expo-location";
import {GOOGLE_API_KEY} from '@env';
import {updateCourier} from "../myExternalLibrary/genericUpdate";
import {getETA_array} from "../myExternalLibrary/LocationFunctions";
import {useCourierContext} from "./CourierContext";

const DirectionContext = createContext({})


const DirectionContextProvider = ({children}) => {
    const apiKey = GOOGLE_API_KEY
    const {dbCourier} = useCourierContext()
    const {liveOrder, pressedOrder} = useOrderContext()
    const {updateCourierOnETAs} = useCourierContext()
    const mapRef = useRef(null)

    const [ETA_toCustomer, setETA_toCustomer] = useState(null)
    const [ETA_toRestaurant, setETA_toRestaurant] = useState(null)
    const [distance, setDistance] = useState(null)
    const [origin, setOrigin] = useState(null)
    const [destination, setDestination] = useState(null)
    const [waypoints, setWaypoints] = useState([])
    // const [tempDestination, setTempDestination] = useState(null)
    // const [tempWaypoints, setTempWaypoints] = useState([])

    const setDirection = ({origin, waypoints, destination}) => {
        setOrigin(origin)
        setDestination(destination)
        setWaypoints(waypoints)
    }

    // const setTempDirection = ({origin, waypoints, destination}) => {
    //     setTempDestination(destination)
    //     setTempWaypoints(waypoints)
    // }

    const whenDriverIsMoving = async (coords) => {
        if (!dbCourier) return
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ whenDriverIsMoving / on init ~~~~~~~~~~~~~~~~~~~~~ :", coords)
        setOrigin({latitude: coords.latitude, longitude: coords.longitude})

        // const areCoordsEqual = expect([coords.latitude, coords.longitude]).toEqual([dbCourier.lat, dbCourier.lng]);
        const areCoordsEqual = (dbCourier.lat === coords.lat && dbCourier.lng === coords.lng)

        if (areCoordsEqual) {
            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ No need to update ~~~~~~~~~~~~~~~~~~~~~")
        } else {
            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ dbCourier.lat === coords.lat ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(dbCourier.lat === coords.lat, null, 4))
            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ dbCourier.lng === coords.lng ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(dbCourier.lng === coords.lng, null, 4))

            await updateCourier(dbCourier.id, {location: {lat: coords.latitude, lng: coords.longitude}})
        }

    }

    const startWatchingDriverLocation = async () => {

        let {status} = await Location.requestForegroundPermissionsAsync()

        switch (status === "granted") {

            case true:
                return await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        distanceInterval: 100
                    },
                    async ({coords}) => {
                        await whenDriverIsMoving(coords)
                    })

            case false:
                console.error('Permission to access location was denied, please try again')
                return await startWatchingDriverLocation()
        }
    }

    const onReady = async (result) => {
        setDistance(result.distance)
        const ETA_arr = getETA_array(result)
        const Prev_ETA_arr = [ETA_toCustomer, ETA_toRestaurant]

        switch (ETA_arr.length) {
            case 0:
                setETA_toRestaurant(0)
                setETA_toCustomer(0)
                break;
            case 1:
                setETA_toRestaurant(0)
                setETA_toCustomer(ETA_arr[0])
                break;
            case 2:
                setETA_toRestaurant(ETA_arr[0])
                setETA_toCustomer(ETA_arr[1])
                break;
            default:
                return
        }
        liveOrder && await updateCourierOnETAs(Prev_ETA_arr, ETA_arr)

    }

    useEffect(() => {

        /**
         * set Direction/TempDirection according to the current status (if there is a live order => the direction must be to its related destination)
         */
        if (!liveOrder && !pressedOrder) return

        const order = liveOrder ?? pressedOrder

        setDirection({
            origin: origin,
            waypoints: order.status === "PICKED_UP" ? [] : [{
                latitude: order.restaurantLocation.lat,
                longitude: order.restaurantLocation.lng
            }],
            destination: {
                latitude: order.customerLocation.lat,
                longitude: order.customerLocation.lng
            }
        })


    }, [liveOrder, pressedOrder])

    useEffect(() => {
        startWatchingDriverLocation().then(unsub => subscription.location = unsub)
        // return ()=>{
        //     subscription.location.unsubscribe()
        // }
    }, [])

    return (
        <DirectionContext.Provider value={{
            startWatchingDriverLocation,
            setDirection,
            // setTempDirection,
            onReady,
            ETA_toCustomer, setETA_toCustomer,
            ETA_toRestaurant, setETA_toRestaurant,
            distance, setDistance,
            origin, destination, waypoints,
            // tempDestination, tempWaypoints,
            apiKey,
            mapRef

        }}>
            {children}
        </DirectionContext.Provider>
    )
}

export default DirectionContextProvider

export const useDirectionContext = () => useContext(DirectionContext)