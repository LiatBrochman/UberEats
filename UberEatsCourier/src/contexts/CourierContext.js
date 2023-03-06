import {createContext, useContext, useEffect, useState} from "react";
import {DataStore} from "aws-amplify";
import {Courier} from "../models";
import {useAuthContext} from "./AuthContext";
import {updateCourier, updateOrder} from "../myExternalLibrary/genericUpdate";
import {compareArrays} from "../myExternalLibrary/genericFunctions";

const CourierContext = createContext({})


const CourierContextProvider = ({children}) => {

    const {sub} = useAuthContext()
    const [dbCourier, setDbCourier] = useState(null)

    useEffect(() => {
        if (!sub) return

        subscription.courier = DataStore.observeQuery(Courier, c => c.sub.eq(sub))
            .subscribe(({items, isSynced}) => {
                if(!isSynced) return

                if (items?.length) {
                    setDbCourier(items[0])
                } else {
                    console.log("no courier was found")
                }
            })

        // return () => {
        //     subscription.courier.unsubscribe()
        // }
    }, [sub])

    const assignToCourier = async ({order, ETA}) => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ assignToCourier ~~~~~~~~~~~~~~~~~~~~~ :")

        await updateOrder(order.id, {courierID: dbCourier.id})

        await updateCourier(dbCourier.id, {
            destinations: [order.restaurantLocation.address, order.customerLocation.address],
            timeToArrive: ETA
        })

    }

    const updateCourierOnETAs = async (prevETA, newETA) => {
    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ updateCourierOnETAs ~~~~~~~~~~~~~~~~~~~~~ :")

        if (compareArrays(prevETA, newETA)) {
            await updateCourier(dbCourier.id,
                {timeToArrive: newETA})
        }

    }

    return (
        <CourierContext.Provider value={{
            dbCourier,
            setDbCourier,
            updateCourierOnETAs,
            assignToCourier,
        }}>
            {children}
        </CourierContext.Provider>
    )
}

export default CourierContextProvider

export const useCourierContext = () => useContext(CourierContext)