import {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";
import {DataStore} from "aws-amplify";
import {Courier, Customer, Dish, Order} from "../models";
import {useRestaurantContext} from "./RestaurantContext";


const OrderContext = createContext({})

const OrderContextProvider = ({children}) => {
    const {restaurant} = useRestaurantContext()

    /**
     * on press (not observed): order, courier, customer, orderDishes
     */
    const [order, setOrder] = useState(null)
    const [courier, setCourier] = useState(null)
    const [customer, setCustomer] = useState(null)
    const [orderDishes, setOrderDishes] = useState([])

    /**
     * observed data : liveOrders, completedOrders, orderDishes
     */
    const [liveCouriersIDs, setLiveCouriersIDs] = useState([])
    const [liveOrders, setLiveOrders] = useState([])
    const [countLiveUpdates, setCountLiveUpdates] = useState(0)
    const [completedOrders, setCompletedOrders] = useState([])
    const [couriers, setCouriers] = useState([])
    const [countETAs, setCountETAs] = useState(0)
    const [ETAs, setETAs] = useState([])

    const ref = useRef({order})

    const fetchAllOrders = useCallback(() => {
        window.subscription.allOrders =
            DataStore.observeQuery(Order, o => o.restaurantID.eq(restaurant.id))
                .subscribe(({items, isSynced}) => {

                    if (isSynced) {

                        const completed = []
                        const live = []
                        const couriersID = []

                        items.forEach(order => {

                            switch (order.status) {

                                case "COMPLETED":
                                case "DECLINED":
                                    completed.push(order)
                                    break;

                                default:
                                    live.push(order)
                                    order.courierID !== "null" && couriersID.push(order.courierID)
                            }
                        })


                        setLiveOrders(live)
                        setCompletedOrders(completed)
                        setLiveCouriersIDs(couriersID)
                        setCountLiveUpdates(prev => prev + 1)
                    }

                })
    }, [restaurant?.id])

    const fetchLiveOrders = useCallback(() => {

        window.subscription.liveOrders = DataStore.observeQuery(Order, o => o.and(o =>
            [
                o.restaurantID.eq(restaurant.id),
                o.status.ne("COMPLETED"),
                o.status.ne("DECLINED")

            ]
        ))
            .subscribe(({items, isSynced}) => {
                if (isSynced) {
                    setLiveOrders(items)
                    setCountLiveUpdates(prev => prev + 1)

                    setLiveCouriersIDs(items.filter(o => o.courierID !== "null").map(o => o.courierID))
                }
            })
    }, [restaurant?.id])

    const fetchCompletedOrders = useCallback(() => {

        window.subscription.completedOrders = DataStore.observeQuery(Order, o => o.and(o =>
            [
                o.restaurantID.eq(restaurant.id),
                o.or(o => [
                    o.status.eq("COMPLETED"),
                    o.status.eq("DECLINED")
                ])
            ]
        )).subscribe(({items, isSynced}) => {
            if (isSynced) {
                setCompletedOrders(items)
                setCountLiveUpdates(prev => prev + 1)
            }
        })
    }, [restaurant?.id])

    const fetchCouriers = useCallback(() => {

        window.subscription.couriers = DataStore.observeQuery(Courier, c => c.or(c => [
            ...liveCouriersIDs.map(id => c.id.eq(id))
        ])).subscribe(({items, isSynced}) => {
            if (!isSynced) return;

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
                        customer: getCustomerArrivalTime(courier),
                        restaurant: getRestaurantArrivalTime(courier)
                    }])
                    break;

                default:
                    setCouriers(items)
                    setETAs(items.map(courier => ({
                        courierID: courier.id,
                        customer: getCustomerArrivalTime(courier),
                        restaurant: getRestaurantArrivalTime(courier)
                    })))
            }
            setCountETAs(prev => prev + 1)

        })

    }, [liveCouriersIDs])

    function getRestaurantArrivalTime(courier) {

        switch (courier.timeToArrive.length) {

            case 0://[]
                return 0

            case 1://[5]
                return 0

            case 2://[5,6]
                return courier.timeToArrive[0]
        }

    }

    function getCustomerArrivalTime(courier) {

        switch (courier.timeToArrive.length) {

            case 0://[]
                return 0

            case 1://[5]
                return courier.timeToArrive[0]

            case 2:
                return courier.timeToArrive[1] + courier.timeToArrive[0]
        }

    }

    function resSubscribeToLiveCouriers() {
        window.subscription?.couriers?.unsubscribe()
        subscribeToLiveCouriers()
    }

    function subscribeToLiveCouriers() {
        if (liveCouriersIDs.length) {

            fetchCouriers()

        } else {

            setCouriers([])
            setETAs([])
            setCountETAs(0)
        }
    }


    function oneOrMore_ContextCourier_isNotHere(liveCouriersIDs) {

        if (couriers.length !== liveCouriersIDs.length) return true

        const localCouriers = new Set(couriers.map(c => c.id))

        return !liveCouriersIDs.every(liveCourierID => localCouriers.has(liveCourierID))
    }

    function getOrder(id) {
        return liveOrders.find(o => o.id === id)
    }


    /**
     * init the :  liveOrders, completedOrders
     */
    useEffect(() => {
        if (!restaurant) return;

        /**
         * fetch LiveOrders ( orders that should be prepared - status: new\accepted\cooking\ready to pick\picked up )
         * fetch LiveCouriersIDs ( easier and more efficient to manage the couriers like this )
         */
        fetchLiveOrders()

        /**
         * fetch CompletedOrders ( both completed and declined orders )
         */
        fetchCompletedOrders()


    }, [restaurant?.id])


    /**
     * Init & re-subscribe couriers
     */
    useEffect(() => {
        if (oneOrMore_ContextCourier_isNotHere(liveCouriersIDs)) {
            resSubscribeToLiveCouriers()
        }
    }, [countLiveUpdates])

    /**
     * On Press (on order):
     *
     * set the related Customer
     * set the related Dishes
     * set the related Courier (from the observed list of couriers)
     */
    useEffect(() => {
        if (!order) return;

        DataStore.query(Customer, order.customerID).then(setCustomer)
        DataStore.query(Dish, d => d.and(d => [d.restaurantID.eq(restaurant.id), d.orderID.eq(order.id)])).then(setOrderDishes)
        setCourier(couriers.find(c => c.id === order.courierID))

    }, [order])


    return (
        <OrderContext.Provider value={{
            ref,

            order,
            setOrder,

            courier,
            setCourier,

            couriers,

            customer,
            setCustomer,

            orderDishes,
            setOrderDishes,

            liveOrders,
            completedOrders,
            countLiveUpdates,
            countETAs,
            ETAs,

            getRestaurantArrivalTime,
            getCustomerArrivalTime,
            getOrder
        }}>
            {children}
        </OrderContext.Provider>
    )
}

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext)
