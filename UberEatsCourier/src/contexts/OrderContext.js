import {createContext, useState, useEffect, useContext} from "react";
import {Auth, DataStore} from "aws-amplify";
import {Courier, Order} from "../models";
import {useAuthContext} from "./AuthContext";

const OrderContext = createContext({});

const OrderContextProvider = ({children}) => {
    const {dbCourier} = useAuthContext();
    const {activeOrder, setActiveOrder} = useState();

    const acceptOrder = (order) => {
// updated the order, and change status, and assign the courier
        DataStore.save(
            Order.copyOf(order, (updated) => {
                updated.status = "ACCEPTED";// update to "ACCEPTED"
                updated.Courier = dbCourier;

            })
        ).then(setActiveOrder);
    }

    return (
        <OrderContext.Provider value={{acceptOrder}}>
            {children}
        </OrderContext.Provider>
    )
}

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext)
