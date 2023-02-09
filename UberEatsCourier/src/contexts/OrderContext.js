import {createContext, useContext, useEffect, useState} from "react";
import {DataStore} from "aws-amplify";
import {Courier, Customer, Dish, Order, Restaurant} from "../models";
import {useAuthContext} from "./AuthContext";
import * as Location from "expo-location";
import {subscription} from "../screens/OrdersScreen";


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
    const [countUpdates, setCountUpdates] = useState(0)
    // useEffect(() => {
    //     // const lastOrder = ORCD?.[0]?.order?.[ORCD?.length - 1]
    //
    //     lastOrder?.status !== "COMPLETED" ||  lastOrder?.status !== "DECLINED" ||  lastOrder?.status !== "PICKED_UP" &&
    //     setActiveOrders(prevOrders => [...prevOrders, lastOrder])
    //
    // }, [ORCD])


    useEffect(() => {
        startWatchingDriverLocation().then(sub => subscription.watchPosition = sub)
        // return () => subscription?.watchPosition?.remove()

    }, [])

    useEffect(() => {

        if (ORCD?.[0]?.order?.id) {


            const filtered = ORCD.filter(orcd => {
                if (
                    orcd.order.status === "COOKING" ||
                    orcd.order.status === "ACCEPTED" ||
                    orcd.order.status === "READY_FOR_PICKUP" ||
                    (orcd.order.courierID === dbCourier?.id && orcd.order.status !== "COMPLETED")
                ) {
                    return orcd
                }
            })
            setActiveORCD(filtered)
        }

    }, [countUpdates])

    useEffect(() => {

        if (dbCourier?.id && !(subscription?.ORCD)) {
            // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~FIRST SUBSCRIPTION: subscription.ORCD ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(subscription.ORCD, null, 4))


            subscription.ORCD = DataStore.observeQuery(Order, o => o.and(o => [
                    o.isDeleted.eq(false),
                    o.or(o => [
                        o.courierID.eq(dbCourier.id),
                        o.courierID.eq('null')
                    ])
                ]
            )).subscribe(({items, isSynced}) => {
                if (!isSynced) return null
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

                    promises.push(new Promise(async (resolve, reject) => {

                        const restaurant = await DataStore.query(Restaurant, order.restaurantID)
                        const dishes = await DataStore.query(Dish, d => d.orderID.eq(order.id))
                        const customer = await DataStore.query(Customer, order.customerID)
                        if (restaurant && dishes && customer) {

                            resolve({order, restaurant, dishes, customer})

                        } else {
                            console.error("REJECTED!!!")
                            reject("couldn't find restaurant or dishes or customer:", restaurant, dishes, customer)
                        }
                    }))
                })

                Promise.allSettled(promises).then((results) => {

                    setORCD(results.map(res => res?.value && res.value))
                    setCountUpdates(prev => prev + 1)
                })

            })

        }
        // return () => subscription?.ORCD?.unsubscribe()

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


    const startWatchingDriverLocation = async () => {

        let {status} = await Location.requestForegroundPermissionsAsync()

        switch (status === "granted") {

            case true:
                Location.getCurrentPositionAsync().then(({coords}) => setDriverLocation({
                    latitude: coords.latitude,
                    longitude: coords.longitude
                }))
                return await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        distanceInterval: 100,
                    },
                    async ({coords}) => {
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
                        DataStore.save(Courier.copyOf(await DataStore.query(Courier, dbCourier?.id)//a must!
                            , updated => {
                                updated.location = {
                                    address: driverLocation?.address || "null",
                                    lat: coords.latitude,
                                    lng: coords.longitude
                                }
                            })).then(setDbCourier)
                    })

            case false:
                console.error('Permission to access location was denied, please try again')
                return await startWatchingDriverLocation()
        }
    }

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
        return await DataStore.save(
            Order.copyOf(order, (updated) => {
                updated.courierID = dbCourier.id
            })
        )
    }
    const cancelOrder = async ({order}) => {
        return await DataStore.save(
            Order.copyOf(order, (updated) => {
                updated.courierID = "null"
            })
        )
    }
    const completeOrder = async ({order}) => {
        return await DataStore.save(
            Order.copyOf(order, (updated) => {
                updated.status = "COMPLETED"
            })
        )
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
            countUpdates,

            setOrder,
            setDishes,
            setCustomer,
            setRestaurant,

            cancelOrder,
            assignToCourier,
            completeOrder,
        }}>
            {children}
        </OrderContext.Provider>
    )
}

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext)
