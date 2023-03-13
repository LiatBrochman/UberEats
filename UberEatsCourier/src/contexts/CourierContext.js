import {createContext, useContext, useEffect, useState} from "react";
import {DataStore} from "aws-amplify";
import {Courier, Order} from "../models";
import {useAuthContext} from "./AuthContext";
import {updateCourier, updateOrder} from "../myExternalLibrary/genericUpdate";
import {compareArrays} from "../myExternalLibrary/globalFunctions";

const CourierContext = createContext({})


const CourierContextProvider = ({children}) => {

    const {sub} = useAuthContext()
    const [dbCourier, setDbCourier] = useState(null)

    useEffect(() => {
        if (!sub) return

        subscription.courier = DataStore.observeQuery(Courier, c => c.sub.eq(sub))
            .subscribe(({items, isSynced}) => {
                if (!isSynced) return

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

    // const updateCourierOnETAs = async (prevETA, newETA) => {
    //     console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ updateCourierOnETAs ~~~~~~~~~~~~~~~~~~~~~ :",newETA)
    //
    //     if (compareArrays(prevETA, newETA)) {
    //         await updateCourier(dbCourier.id,
    //             {timeToArrive: newETA})
    //     }
    //
    // }
    const safeUpdateCourier = async ({ETA, origin}) => {
        const lat = origin.latitude, lng= origin.longitude;

        if (compareArrays(dbCourier.timeToArrive, ETA)) {

            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ updating DB Courier - On ETAs change ~~~~~~~~~~~~~~~~~~~~~ :", ETA)

            await updateCourier(dbCourier.id, {
                timeToArrive:ETA,
                location: {lat,lng}
            })


        }else{
            await updateCourier(dbCourier.id, {
                location: {lat,lng}
            })

        }



    }
    const completeOrder = async (id) => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ order id ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(id, null, 4))

        return updateCourier(dbCourier.id, {destinations: [], timeToArrive: []})
            .then(() =>
                updateOrder(id, {status: "COMPLETED"})
                    .then(() =>
                        "finished"))
    }


    const fixCourierOnInit = async () => {
        if (!dbCourier) return

        if (dbCourier.timeToArrive.length > 0 || dbCourier.destinations.length > 0) {

            if (await existingLiveOrder()) {
                console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ existingLiveOrder was found ~~~~~~~~~~~~~~~~~~~~~ :")
            } else {
                await updateCourier(dbCourier.id, {destinations: [], timeToArrive: []})
                console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ fixCourierOnInit ~~~~~~~~~~~~~~~~~~~~~ :")
            }

        }

    }

    useEffect(() => {

        if (dbCourier?.timeToArrive && dbCourier.timeToArrive.length > 2) {

            console.log("\n\n !!!!!!!!!!!!!!!! dbCourier.timeToArrive ~~~~~~~~~~~~~~~~~~~~~ :", dbCourier.timeToArrive);

            (async () => await fixCourierOnWeirdUpdates())()

        }

    }, [dbCourier])
    const fixCourierOnWeirdUpdates = async () => {
        const {status} = await DataStore.query(Order, o => o.and(o =>
            [
                o.courierID.eq(dbCourier.id),
                o.status.ne("COMPLETED"),
                o.status.ne("DECLINED")
            ]
        ))

        const tempETA = [...dbCourier.timeToArrive]

        switch (status) {

            case "ACCEPTED":
            case "COOKING":
            case "READY_FOR_PICKUP":
                while (tempETA.length > 2) tempETA.shift()
                await updateCourier(dbCourier.id, {timeToArrive: tempETA})
                break;

            case "PICKED_UP":
                while (tempETA.length > 1) tempETA.shift()
                await updateCourier(dbCourier.id, {timeToArrive: tempETA})
                break;

            default:
                console.error("what is happening here???...")
        }

    }

    const existingLiveOrder = async () => {
        return !!(await DataStore.query(Order, o => o.and(o => [
            o.courierID.eq(dbCourier.id),
            o.status.ne("COMPLETED"),
            o.status.ne("DECLINED")
        ])))?.[0]
    }

    return (
        <CourierContext.Provider value={{
            dbCourier,
            setDbCourier,
            // updateCourierOnETAs,
            safeUpdateCourier,
            assignToCourier,
            completeOrder,
            fixCourierOnInit,

        }}>
            {children}
        </CourierContext.Provider>
    )
}

export default CourierContextProvider

export const useCourierContext = () => useContext(CourierContext)