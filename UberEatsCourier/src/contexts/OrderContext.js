import {createContext, useContext, useEffect, useRef, useState} from "react";
import {DataStore} from "aws-amplify";
import {Courier, Customer, Dish, Order, Restaurant} from "../models";
import {useAuthContext} from "./AuthContext";
import * as Location from "expo-location";
import {subscription} from "../screens/OrdersScreen";
import {getAddressByCoords} from "../myExternalLibrary/LocationFunctions";


const OrderContext = createContext({})

const OrderContextProvider = ({children}) => {

    const {dbCourier, setDbCourier} = useAuthContext()
    const [order, setOrder] = useState(null)
    const [liveOrder, setLiveOrder] = useState(null)
    const [dishes, setDishes] = useState([])
    const [customer, setCustomer] = useState(null)
    const [restaurant, setRestaurant] = useState(null)
    const [driverLocation, setDriverLocation] = useState(null)
    const [ORCD, setORCD] = useState([])
    const [activeORCD, setActiveORCD] = useState([])
    const [distance,setDistance] = useState(10)
    const [countOrderUpdates, setCountOrderUpdates] = useState(0)
    const [waypointDurations, setWaypointDurations] = useState([])

    const ref = useRef({liveOrder, waypointDurations, distance})


    useEffect(() => {
        if (!dbCourier) return

        DataStore.observeQuery(Order, o => o.and(o => [
            o.isDeleted.eq(false),
            o.courierID.eq(dbCourier.id),
            o.or(o => [
                o.status.eq("ACCEPTED"),
                o.status.eq("COOKING"),
                o.status.eq("READY_FOR_PICKUP"),
                o.status.eq("PICKED_UP")
            ])
        ])).subscribe(({items: [foundLiveOrder], isSynced}) => {
            if (foundLiveOrder && isSynced) {
                setLiveOrder(foundLiveOrder)
                ref.current.liveOrder = foundLiveOrder
            }
        })
    }, [dbCourier])

    const whenDriverIsMoving = async (coords, newAddress) => {
        if (!dbCourier) return

        /**
         * update driver location in the context every 100meters
         */
        setDriverLocation({
            latitude: coords.latitude,
            longitude: coords.longitude,
        })

        /**
         * update driver location also in the DB every 100meters
         */
        dbCourier &&console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~before updating DB of courier: ref.current ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(ref.current,null,4))

        dbCourier && DataStore.save(Courier.copyOf(await DataStore.query(Courier, dbCourier.id)
            , updated => {
                updated.location = {
                    address: newAddress || "null",
                    lat: coords.latitude,
                    lng: coords.longitude
                }
                // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ whenDriverIsMoving: liveOrder ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(liveOrder, null, 4))
                // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ ref.current.liveOrder ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(ref.current.liveOrder, null, 4))
                // if (liveOrder) {
                //     switch (liveOrder.status) {
                //         case "ACCEPTED":
                //         case "COOKING":
                //         case "READY_FOR_PICKUP":
                //         case "PICKED_UP":
                //             console.log("updating courier's destinations + timeToArrive")
                //             updated.destinations = [restaurant.location.address, customer.location.address]
                //             updated.timeToArrive = waypointDurations
                //             break;
                //
                //         case "COMPLETED":
                //         case "DECLINED":
                //         case "NEW":
                //             break;
                //
                //         default:
                //             console.error("default on liveOrder.status", liveOrder.status)
                //
                //     }
                //
                // } else
                if (ref.current.liveOrder) {

                    switch (ref.current.liveOrder.status) {
                        case "ACCEPTED":
                        case "COOKING":
                        case "READY_FOR_PICKUP":
                        case "PICKED_UP":
                            switch (ref.current.waypointDurations.length) {

                                case 0:
                                    break;

                                case 1:
                                    updated.timeToArrive = ref.current.waypointDurations
                                    updated.destinations = [ref.current.liveOrder.customerLocation.address]
                                    break;

                                case 2:
                                    updated.timeToArrive = ref.current.waypointDurations
                                    updated.destinations = [ref.current.liveOrder.restaurantLocation.address, ref.current.liveOrder.customerLocation.address]
                                    break;
                            }
                            break;

                        case "COMPLETED":
                        case "DECLINED":
                        case "NEW":
                            break;

                        default:
                            console.error("default on liveOrder.status", ref.current.liveOrder.status)

                    }
                }

            })).then(setDbCourier)
    }

    const startWatchingDriverLocation = async () => {

        let {status} = await Location.requestForegroundPermissionsAsync()

        switch (status === "granted") {

            case true:
                // Location.getCurrentPositionAsync().then(({coords}) => setDriverLocation({
                //     latitude: coords.latitude,
                //     longitude: coords.longitude
                // }))
                return await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        distanceInterval: 100,
                    },
                    async ({coords}) => {
                        await whenDriverIsMoving(coords, await getAddressByCoords(coords))

                    })

            case false:
                console.error('Permission to access location was denied, please try again')
                return await startWatchingDriverLocation()
        }
    }

    // useEffect(() => {
    //     // const lastOrder = ORCD?.[0]?.order?.[ORCD?.length - 1]
    //
    //     lastOrder?.status !== "COMPLETED" ||  lastOrder?.status !== "DECLINED" ||  lastOrder?.status !== "PICKED_UP" &&
    //     setActiveOrders(prevOrders => [...prevOrders, lastOrder])
    //
    // }, [ORCD])


    // useEffect(() => {
    //     startWatchingDriverLocation().then(sub => subscription.watchPosition = sub)
    //     // return () => subscription?.watchPosition?.remove()
    //
    // }, [])

    useEffect(() => {
        if (ORCD.length === 0) return

        const filteredORCD = ORCD.filter((orcd) => {
            const {order} = orcd
            if (
                order.status === "COOKING" ||
                order.status === "ACCEPTED" ||
                order.status === "READY_FOR_PICKUP" ||
                (order.courierID === dbCourier?.id && order.status !== "COMPLETED")
            ) {
                return orcd
            }
        })
        setActiveORCD(filteredORCD)


    }, [countOrderUpdates])

    useEffect(() => {


        if (dbCourier && !(subscription?.ORCD)) {
            // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~FIRST SUBSCRIPTION: subscription.ORCD ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(subscription.ORCD, null, 4))


            subscription.ORCD = DataStore.observeQuery(Order, o => o.and(o => [
                    o.isDeleted.eq(false),
                    o.or(o => [
                        o.courierID.eq(dbCourier.id),
                        o.courierID.eq('null')
                    ])
                ]
            )).subscribe(({items, isSynced}) => {
                if (!isSynced) return
                /** explanation:
                 * ORCD =
                 * [
                 *      { "order":{}, "restaurant":{}, "customer":{}, "dishes":[] },
                 *      {...},
                 *      {...},
                 *      {...}
                 * ]
                 */

                const promises = []

                items.forEach(order => {

                    promises.push(new Promise(async (resolve) => {

                        const restaurant = await DataStore.query(Restaurant, order.restaurantID)
                        const dishes = await DataStore.query(Dish, d => d.orderID.eq(order.id))
                        const customer = await DataStore.query(Customer, order.customerID)
                        if (restaurant && dishes && customer) {

                            resolve({order, restaurant, dishes, customer})

                        } else {
                            console.error("REJECTED!! couldn't find restaurant or dishes or customer:", restaurant, dishes, customer)
                        }
                    }))
                })

                Promise.allSettled(promises).then((results) => {
                    //console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ results ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(results, null, 4))

                    setORCD(results.map(res => res.hasOwnProperty('value') && res.value))
                    setCountOrderUpdates(prev => prev + 1)
                })

            })
            startWatchingDriverLocation().then(sub => subscription.watchPosition = sub)

        }
        // return () => {
        //     subscription?.ORCD?.unsubscribe()
        //     subscription?.watchPosition?.remove()
        // }

    }, [dbCourier])


    // useEffect(() => {
    //     /**
    //      * update driver location in the DB every 100meters
    //      */
    //     if (dbCourier?.id && driverLocation?.latitude && driverLocation?.longitude) {
    //         const newLocation = {
    //             address: driverLocation?.address || "null",
    //             lat: driverLocation.latitude,
    //             lng: driverLocation.longitude
    //         }
    //         DataStore.query(Courier, dbCourier.id).then(dbCourier => {
    //             DataStore.save(Courier.copyOf(dbCourier, updated => {
    //                 updated.location = newLocation
    //             })).then(updatedCourier => {
    //                 //console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ Courier after updated location ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(updatedCourier, null, 4))
    //                 setDbCourier(updatedCourier)
    //             })
    //         })
    //
    //
    //     }
    // }, [driverLocation])


    // const startSendingDriverLocation = async () => {
    //
    //     let {status} = await Location.requestForegroundPermissionsAsync()
    //
    //     switch (status === "granted") {
    //
    //         case true:
    //             return await Location.watchPositionAsync(
    //                 {
    //                     accuracy: Location.Accuracy.High,
    //                     distanceInterval: 100,
    //                 },
    //                 ({coords}) => {
    //                     setDriverLocation({
    //                         latitude: coords.latitude,
    //                         longitude: coords.longitude,
    //                     })
    //
    //                     DataStore.save(Courier.copyOf(dbCourier, updated => {
    //                             updated.location = driverLocation
    //                         })
    //                     )
    //                 })
    //
    //         case false:
    //             console.error('Permission to access location was denied, please try again')
    //             return await startWatchingDriverLocation()
    //     }
    // }


    const assignToCourier = async ({order}) => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ assign order to courier ~~~~~~~~~~~~~~~~~~~~~ :")
        DataStore.save(
            Order.copyOf(await DataStore.query(Order, order.id), (updated) => {
                updated.courierID = dbCourier.id
            })
        ).then(setLiveOrder)
        DataStore.save(Courier.copyOf(await DataStore.query(Courier, dbCourier.id), updated => {
            updated.location = {
                lat: driverLocation.latitude,
                lng: driverLocation.longitude,
            }
            updated.destinations = [restaurant.location.address, customer.location.address]
            updated.timeToArrive = waypointDurations
        })).then(setDbCourier)
    }
    const cancelOrder = async ({order}) => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ cancelOrder ~~~~~~~~~~~~~~~~~~~~~ :")


        ref.current.liveOrder = null
        ref.current.waypointDurations = []

        DataStore.save(Order.copyOf(await DataStore.query(Order, order.id), (updated) => {
            updated.courierID = "null"
        })).then(() => setLiveOrder(null))
    }

    const completeOrder = async ({order}) => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ completeOrder ~~~~~~~~~~~~~~~~~~~~~ :")


        ref.current.liveOrder = null
        ref.current.waypointDurations = []

        DataStore.save(Order.copyOf(await DataStore.query(Order, order.id), (updated) => {
            updated.status = "COMPLETED"
        })).then(() => setLiveOrder(null))
        DataStore.save(Courier.copyOf(await DataStore.query(Courier, dbCourier.id), updated => {
            updated.destinations = []
            updated.timeToArrive = []
        })).then(setDbCourier)
    }


    return (
        <OrderContext.Provider value={{
            order,
            dishes,
            customer,
            restaurant,
            driverLocation,
            ORCD,
            activeORCD,
            countOrderUpdates,

            setOrder,
            setDishes,
            setCustomer,
            setRestaurant,

            cancelOrder,
            assignToCourier,
            completeOrder,

            setWaypointDurations,
            setDistance,
            ref
        }}>
            {children}
        </OrderContext.Provider>
    )
}

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext)
