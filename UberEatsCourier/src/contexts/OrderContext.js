import {createContext, useState, useContext, useEffect} from "react";
import {DataStore} from "aws-amplify";
import {Order, Dish, Restaurant, Customer} from "../models";
import {useAuthContext} from "./AuthContext";
import * as Location from "expo-location";

const OrderContext = createContext({});

const OrderContextProvider = ({children}) => {
    const {dbCourier} = useAuthContext();
    const [order, setOrder] = useState();
    const [customer, setCustomer] = useState();
    const [restaurant, setRestaurant] = useState(null);
    const [dishes, setDishes] = useState([]);
    const [orders, setOrders] = useState([])
    const [restaurants, setRestaurants] = useState([])
    const [driverLocation, setDriverLocation] = useState({latitude:32, longitude:34})
    const startWatchingDriverLocation = async () => {
        await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                distanceInterval: 100,
            },
            (updatedLocation) => {
                setDriverLocation({
                    latitude: updatedLocation.coords.latitude,
                    longitude: updatedLocation.coords.longitude,
                });
            })
            // .then(setForegroundSubscription)

        // let location = await Location.getCurrentPositionAsync()
        // return setDriverLocation({
        //     latitude: location.coords.latitude,
        //     longitude: location.coords.longitude,
        // })
    }
    // const route = useRoute();
    // const id = route.params?.id;

    const fetchOrder = (id) => {
        if (id) {
            //const fetchedOrder = await DataStore.query(Order, id);
            DataStore.query(Order, id).then(setOrder)
        }
        //setOrder(fetchedOrder);
    }

    const fetchCustomer = (order) => {
        if (order) {
            DataStore.query(Customer, order.customerID).then(setCustomer)
            DataStore.query(Restaurant, order.restaurantID).then(setRestaurant)
            DataStore.query(Dish, od => od.orderID.eq(order.id)).then(setDishes)
        }
        //  setUser(fetchedUser);
    }

    const acceptOrder = () => {
// updated the order, and change status, and assign the courier
        DataStore.save(
            Order.copyOf(order, (updated) => {
                updated.status = "ACCEPTED";// update to "ACCEPTED"
                updated.Courier = dbCourier;

            })
        ).then(setOrder);
    }

    const pickupOrder = () => {
// updated the order, and change status, and assign the courier
        DataStore.save(
            Order.copyOf(order, (updated) => {
                updated.status = "PICKED_UP";// update to "ACCEPTED"
                updated.Courier = dbCourier;

            })
        ).then(setOrder);
    }

    const completeOrder = () => {
// updated the order, and change status, and assign the courier
        DataStore.save(
            Order.copyOf(order, (updated) => {
                updated.status = "COMPLETED";// update to "ACCEPTED"
                updated.Courier = dbCourier;

            })
        ).then(setOrder);
    }

    useEffect(() => {
        DataStore.query(Order, (order) => order.status.eq("READY_FOR_PICKUP")).then(setOrders);
        DataStore.query(Restaurant).then(setRestaurants)
        startWatchingDriverLocation()
    }, [])

    // useEffect(()=>{
    //   const intervalID = setInterval(async ()=>{
    //      updateDriverLocation().then(currentDriverLocation=>{
    //          if(currentDriverLocation.lat===customer?.location.lat && currentDriverLocation.lng
    //      })
    //
    //   },10*1000)
    //
    // },[])

    return (
        <OrderContext.Provider value={{
            acceptOrder,
            order,
            customer,
            fetchOrder,
            fetchCustomer,
            restaurant,
            dishes,
            pickupOrder,
            completeOrder,
            driverLocation
        }}>
            {children}
        </OrderContext.Provider>
    )
}

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext)
