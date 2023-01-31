import {createContext, useContext, useEffect, useState} from "react";
import {useOrderContext} from "./OrderContext";
import {DataStore} from "aws-amplify";
import {Courier} from "../models";


const CourierContext = createContext({})


const CourierContextProvider = ({children}) => {
    const {orders} = useOrderContext()
    const [courier, setCourier] = useState(null)


    useEffect(() => {
        if (orders) {
            const orderWithCourier = orders?.length > 0 && orders.find(o => {
                if (o?.courierID && o?.courierID !== "null") {
                    return o?.courierID
                }
            })
            if (orderWithCourier && orderWithCourier?.courierID) {

                subscription.courier = DataStore.observeQuery(Courier, c => c.id.eq(orderWithCourier.courierID))
                    .subscribe(({items, isSynced}) => {
                        // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ updated courier ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(items?.[0],null,4))
                        isSynced && setCourier(items?.[0])
                    })
            }
        }
        // return subscription?.courier?.unsubscribe()
    }, [orders])

    return (
        <CourierContext.Provider value={{
            courier
        }}>
            {children}
        </CourierContext.Provider>
    )

}

export default CourierContextProvider

export const useCourierContext = () => useContext(CourierContext)