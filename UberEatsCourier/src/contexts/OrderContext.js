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
    const [dishes, setDishes] = useState([])
    const [customer, setCustomer] = useState(null)
    const [restaurant, setRestaurant] = useState(null)
    const [driverLocation, setDriverLocation] = useState(null)
    const [ORCD, setORCD] = useState([])
    const [activeORCD, setActiveORCD] = useState([])
    const [countOrderUpdates, setCountOrderUpdates] = useState(0)
    const ref = useRef({liveOrder: null, waypointDurations: [], distance: 10})


    useEffect(() => {
        /**
         * find out if there is any live order (and subscribe to it)
         *
         * exit if there is no courier \ already has a live order
         */
        if (!dbCourier || ref.current.liveOrder) return

        subscription.liveOrder = DataStore.observeQuery(Order, o => o.and(o => [
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
                ref.current.liveOrder = foundLiveOrder
            }
        })

    }, [dbCourier])

    const whenDriverIsMoving = async (coords, newAddress) => {
        if (!dbCourier) return

        /**
         * every 100meters : update driver location both in the DB and in DriverLocation's state
         */
        setDriverLocation({
            latitude: coords.latitude,
            longitude: coords.longitude,
        })

        if (dbCourier) {
            DataStore.save(Courier.copyOf(await DataStore.query(Courier, dbCourier.id),
                updated => {
                    updated.location = {
                        address: newAddress || "null",
                        lat: coords.latitude,
                        lng: coords.longitude
                    }

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

                }))
                .then(setDbCourier)
        }

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
                        distanceInterval: 100
                    },
                    async ({coords}) => {

                        /**
                         * this func will run also on initiation
                         */
                        await whenDriverIsMoving(coords, await getAddressByCoords(coords))

                    })

            case false:
                console.error('Permission to access location was denied, please try again')
                return await startWatchingDriverLocation()
        }
    }


    useEffect(() => {
        /**
         * set up all the active orders (available orders + the assigned order if there is any)
         */
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

        /**
         * set up the
         *
         * ORCD =
         * [
         *      { "order":{}, "restaurant":{}, "customer":{}, "dishes":[] },
         *      {...},
         *      {...},
         *      {...}
         * ]
         *
         *
         * O: orders = listening to all the active + available orders
         * R: restaurant = 1 restaurant, related to the order.
         * C: customer = 1 customer,  related to the order.
         * D: dishes = array of dishes, related to the order.
         *
         *
         * ---------**only orders are being observed, while the rest are being queried whenever order is being updated.**----------*/


        if (!dbCourier || subscription.hasOwnProperty("ORCD")) return;

            subscription.ORCD = DataStore.observeQuery(Order, o => o.and(o => [
                    o.isDeleted.eq(false),
                    o.or(o => [
                        o.courierID.eq(dbCourier.id),
                        o.courierID.eq('null')
                    ])
                ]
            )).subscribe(({items, isSynced}) => {
                if (!isSynced) return

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


        // return () => {
        //     subscription?.ORCD?.unsubscribe()
        //     subscription?.watchPosition?.remove()
        // }

    }, [dbCourier])


    const assignToCourier = async ({order}) => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ assign order to courier ~~~~~~~~~~~~~~~~~~~~~ ETAs :", ref.current.waypointDurations)

        DataStore.save(
            Order.copyOf(await DataStore.query(Order, order.id), (updated) => {
                updated.courierID = dbCourier.id
            })
        ).then(updatedOrder => {
            ref.current.liveOrder = updatedOrder
        })

        DataStore.save(Courier.copyOf(await DataStore.query(Courier, dbCourier.id), updated => {
            updated.location = {
                lat: driverLocation.latitude,
                lng: driverLocation.longitude,
            }
            updated.destinations = [restaurant.location.address, customer.location.address]
            updated.timeToArrive = ref.current.waypointDurations
        })).then(setDbCourier)
    }

    function clearLiveOrder() {
        ref.current.liveOrder = null
        ref.current.waypointDurations = []
        ref.current.distance = 10
    }

    const cancelOrder = async ({order}) => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ cancelOrder ~~~~~~~~~~~~~~~~~~~~~ :")

        DataStore.save(Order.copyOf(await DataStore.query(Order, order.id), (updated) => {
            updated.courierID = "null"
        })).then(() => clearLiveOrder())
        DataStore.save(Courier.copyOf(await DataStore.query(Courier, dbCourier.id), updated => {
            updated.destinations = []
            updated.timeToArrive = []
        })).then(setDbCourier)
    }

    const completeOrder = async ({order}) => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ completeOrder ~~~~~~~~~~~~~~~~~~~~~ :")

        DataStore.save(Order.copyOf(await DataStore.query(Order, order.id), (updated) => {
            updated.status = "COMPLETED"
        })).then(() => clearLiveOrder())
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

            ref
        }}>
            {children}
        </OrderContext.Provider>
    )
}

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext)
