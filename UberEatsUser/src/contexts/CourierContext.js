import {createContext, useContext, useEffect, useState} from "react";
import {useOrderContext} from "./OrderContext";
import {DataStore} from "aws-amplify";
import {Courier} from "../models";


const CourierContext = createContext({})


const CourierContextProvider = ({children}) => {
    const {orders} = useOrderContext()
    const [courier, setCourier] = useState(null)
    const [duration,setDuration]=useState(null)

    useEffect(() => {
        if (orders) {
            const orderWithCourier = orders?.length && orders.find(o => {
                if (o?.courierID && o?.courierID !== "null") {
                    return o?.courierID
                }
            })
            if (orderWithCourier && orderWithCourier?.courierID) {

                subscription.courier = DataStore.observeQuery(Courier, c => c.id.eq(orderWithCourier.courierID))
                    .subscribe(({items, isSynced}) => {
                      if  (isSynced){
                          setCourier(items?.[0])
                          const totalTime = items?.[0].timeToArrive.reduce((total,current)=>total+current)
                          setDuration(totalTime)
                      }
                    })
            }
        }
        // return subscription?.courier?.unsubscribe()
    }, [orders])

    return (
        <CourierContext.Provider value={{
            courier,
            duration
        }}>
            {children}
        </CourierContext.Provider>
    )

}

export default CourierContextProvider

export const useCourierContext = () => useContext(CourierContext)
