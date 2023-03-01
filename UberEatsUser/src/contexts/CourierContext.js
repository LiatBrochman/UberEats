import {createContext, useContext, useEffect, useState} from "react";
import {useOrderContext} from "./OrderContext";
import {DataStore} from "aws-amplify";
import {Courier} from "../models";


const CourierContext = createContext({})


const CourierContextProvider = ({children}) => {

    const {liveOrders, countUpdates} = useOrderContext({liveOrders:[],countUpdates:0})


    const [couriers, setCouriers] = useState([])
    const [ETAs, setETAs] = useState([])


    function fetchCouriers() {

        subscription.couriers = liveOrders.map(liveOrder => {
                console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ liveOrder.id ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(liveOrder.id, null, 4))

                DataStore.observeQuery(Courier, c => c.id.eq(liveOrder.courierID))
                    .subscribe(({items, isSynced}) => {
                        if (isSynced) {
                            if (items.length === 0) {
                                setCouriers([])
                                setETAs([])
                            } else {
                                const courier = items[0]
                                setCouriers(prevCouriers => [...prevCouriers.filter(c => c.id !== courier.id), courier])
                                setETAs(prev => [...prev, {
                                    courierID: courier.id,
                                    ETA: courier.timeToArrive.reduce((total, current) => total + current, 0)
                                }])
                            }
                        }
                    })
            }
        )

    }

    function needToFetchCouriers() {
        /**
         * sub/re-sub couriers whenever:
         * 1. a courier accept our order (order gets an courier ID)
         * 2. order has been completed/declined
         */

        const liveOrdersWithCourier = liveOrders.filter(o => o.courierID !== "null")

        if (liveOrdersWithCourier.length === couriers.length) {
            return false
        }
        /**
         * here we cover both options:
         * either our context couriers are LESS than the real amount of couriers: a new courier has arrived
         * either our context couriers are MORE than the real amount of couriers: an order has been completed/declined
         */
        return true
    }

    useEffect(() => {
            if (liveOrders.length === 0) return;

            /**
             * init couriers + update couriers
             */

            needToFetchCouriers() && fetchCouriers()


        },
        [countUpdates])


    return (
        <CourierContext.Provider value={{
            couriers,
            ETAs,
        }}>
            {children}
        </CourierContext.Provider>
    )

}

export default CourierContextProvider

export const useCourierContext = () => useContext(CourierContext)
