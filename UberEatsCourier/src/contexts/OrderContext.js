import {createContext, useState, useContext, useEffect} from "react";
import {DataStore} from "aws-amplify";
import {Order, Dish, Restaurant, Customer} from "../models";
import {useAuthContext} from "./AuthContext";
import * as Location from "expo-location";
import {subscription} from "../screens/OrdersScreen";

const OrderContext = createContext({})

const OrderContextProvider = ({children}) => {

    const {dbCourier} = useAuthContext({})
    const [order, setOrder] = useState({})
    const [dishes, setDishes] = useState([])
    const [customer, setCustomer] = useState({})
    const [restaurant, setRestaurant] = useState({})
    const [driverLocation, setDriverLocation] = useState({})
    const [ORCD, setORCD] = useState([])


    useEffect(() => {

        if (dbCourier) {

            subscription.ORCD = DataStore.observeQuery(Order, o => o.and(o => [
                    o.courierID.eq('null'),
                    o.isDeleted.eq(false)
                ]
            )).subscribe(({items}) => {

                /** explanation:
                 * ORCD =
                 * [
                 *      { "order":{}, "restaurant":{}, "customer"={}, "dishes":[] ,},
                 *      {...},
                 *      {...},
                 *      {...}
                 * ]
                 */

                const promises = []

                items.forEach(order => {

                    promises.push(new Promise(async (resolve, reject) => {

                        if (!order) {
                            console.error("REJECTED!!!")
                            reject("couldn't find order", order)
                        }

                        const restaurant = await DataStore.query(Restaurant, order.restaurantID)
                        const dishes = await DataStore.query(Dish, d => d.orderID.eq(order.id))
                        const customer = await DataStore.query(Customer, order.customerID)

                        if (restaurant && dishes && customer) {

                            resolve({order, restaurant, customer, dishes})

                        } else {
                            console.error("REJECTED!!!")
                            reject("couldn't find restaurant / dishes / customer:", restaurant, dishes, customer)
                        }
                    }))
                })

                Promise.allSettled(promises).then(results => {

                    console.log(results)

                    if (results.every(result => result.status === "fulfilled")) {
                        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ setORCD(results.map(res => res.value)) ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(setORCD(results.map(res => res.value)), null, 4))
                    }

                })


            })

            startWatchingDriverLocation().then(sub => subscription.watchPosition = sub)

        }

        return () => {
            subscription?.ORCD?.unsubscribe()
            subscription?.watchPosition?.remove()
        }


    }, [dbCourier])

    const startWatchingDriverLocation = async () => {
        return await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                distanceInterval: 100,
            },
            ({coords}) => {
                setDriverLocation({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                })
            })
    }

    const acceptOrder = async ({order}) => {
        return await DataStore.save(
            Order.copyOf(order, (updated) => {
                updated.courierID = dbCourier.id
                updated.Courier = dbCourier
            })
        )
    }
    const cancelOrder = async ({order}) => {
        return await DataStore.save(
            Order.copyOf(order, (updated) => {
                updated.courierID = "null"
                updated.Courier = dbCourier
            })
        )
    }
    const pickupOrder = async ({order}) => {
        return await DataStore.save(
            Order.copyOf(order, (updated) => {
                updated.status = "PICKED_UP"
                updated.Courier = dbCourier

            })
        )
    }

    const completeOrder = async ({order}) => {
        return await DataStore.save(
            Order.copyOf(order, (updated) => {
                updated.status = "COMPLETED"
                updated.Courier = dbCourier
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

            setOrder,
            setDishes,
            setCustomer,
            setRestaurant,

            cancelOrder,
            acceptOrder,
            pickupOrder,
            completeOrder,
        }}>
            {children}
        </OrderContext.Provider>
    )
}

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext)
