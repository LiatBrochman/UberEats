import {createContext, useContext, useEffect, useState} from "react";
import {useOrderContext} from "./OrderContext";
import {DataStore} from "aws-amplify";
import {Courier, Order} from "../models";


const CourierContext = createContext({})


const CourierContextProvider = ({children}) => {

    const {liveCouriersIDs} = useOrderContext({liveCouriersIDs: [], liveOrders: []})
    const [couriers, setCouriers] = useState([])
    const [ETAs, setETAs] = useState([])
    const [countETAs, setCountETAs] = useState(0)


    function subscribeToLiveCouriers() {

        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ trying to subscribe to live couriers ~~~~~~~~~~~~~~~~~~~~~ ")

        if (subscription?.couriers) {
            subscription.couriers.unsubscribe()
        }

        subscription.couriers = DataStore.observeQuery(Courier, c => c.or(c => [
            ...liveCouriersIDs.map(id => c.id.eq(id))
        ])
        ).subscribe(({items, isSynced}) => {
            if (!isSynced) return;

            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ subscribing Couriers ~~~~~~~~~~~~~~~~~~~~~ found : ", items?.length, "couriers")

            switch (items?.length) {

                case undefined:
                case 0:
                    setCouriers([])
                    setETAs([])
                    break;

                case 1:
                    const courier = items[0]
                    setCouriers([courier])
                    setETAs([{
                        courierID: courier.id,
                        time: courier.timeToArrive[0] + (courier.timeToArrive?.[1] || 0)
                    }])
                    break;

                default:
                    setCouriers(items)
                    setETAs(items.map(courier => ({
                        courierID: courier.id,
                        time: courier.timeToArrive[0] + (courier.timeToArrive?.[1] || 0)
                    })))
            }
            setCountETAs(prev => prev + 1)

        })
    }

    function unSubCouriers() {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ unsubscribing all Couriers ~~~~~~~~~~~~~~~~~~~~~ ")
        subscription.couriers.unsubscribe()
        setCouriers([])
        setETAs([])
        setCountETAs(0)
    }

    useEffect(() => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ amount of Live Couriers IDs~~~~~~~~~~~~~~~~~~~~~ :", liveCouriersIDs.length)

        if (liveCouriersIDs.length === 0) {
            if (subscription?.couriers) {
                unSubCouriers()
            }
            return
        }

        subscribeToLiveCouriers()

    }, [liveCouriersIDs.length])

    return (
        <CourierContext.Provider value={{
            couriers,
            ETAs,
            countETAs
        }}>
            {children}
        </CourierContext.Provider>
    )

}

export default CourierContextProvider

export const useCourierContext = () => useContext(CourierContext)
