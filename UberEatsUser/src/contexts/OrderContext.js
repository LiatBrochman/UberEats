import {createContext, useContext, useEffect, useState} from "react";
import {DataStore} from "aws-amplify";
import {Dish, Order} from "../models";
import {useAuthContext} from "./AuthContext";
import {useBasketContext} from "./BasketContext";
import {useRestaurantContext} from "./RestaurantContext";
import {Alert} from 'react-native';

const OrderContext = createContext({})

const OrderContextProvider = ({children}) => {

    const {dbCustomer} = useAuthContext()
    const {restaurant} = useRestaurantContext()
    const {totalPrice, basketDishes, setBasketDishes, setTotalPrice, setTotalBasketQuantity} = useBasketContext()
    const [order, setOrder] = useState(null)
    const [completedOrders, setCompletedOrders] = useState([])
    const [liveOrders, setLiveOrders] = useState([])
    const [orderDishes, setOrderDishes] = useState([])
    const [countUpdates, setCountUpdates] = useState(0)
    const [liveCouriersIDs, setLiveCouriersIDs] = useState([])


    useEffect(() => {
        if (!dbCustomer || subscription.hasOwnProperty("liveOrders")) return;

        /**
         * init live orders
         */

        subscribeToLiveOrders()

        /**
         * init the rest of the orders
         */

        subscribeToCompletedOrders()


    }, [dbCustomer])


    useEffect(() => {
        if (!order) return;

        /**
         * init order dishes
         */

        DataStore.query(Dish, d => d.and(d => [
            d.orderID.eq(order.id),
            d.isDeleted.eq(false)
        ])).then(setOrderDishes)

    }, [order])


    function onLiveOrderEvent(items) {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ onLiveOrderEvent ~~~~~~~~~~~~~~~~~~~~~ items?.length:", items?.length)
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ live order event ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(items, null, 4))

        switch (items?.length) {
            case undefined:
            case 0:
                setLiveOrders([])
                setLiveCouriersIDs([])
                setCountUpdates(prev => prev + 1)
                break;

            case 1:
                setLiveOrders(items)
                setLiveCouriersIDs(
                    items[0].courierID === "null" ? [] : [items[0].courierID]
                )
                setCountUpdates(prev => prev + 1)
                break;

            default :
                setLiveOrders(items)
                setLiveCouriersIDs(items.filter(o => o.courierID !== "null").map(o => o.courierID))
                setCountUpdates(prev => prev + 1)

        }

    }

    function subscribeToLiveOrders() {
        subscription.liveOrders = DataStore.observeQuery(Order, o => o.and(o => [
            o.customerID.eq(dbCustomer.id),
            o.isDeleted.eq(false),
            o.status.ne("COMPLETED"),
            o.status.ne("DECLINED")
        ])).subscribe(({items, isSynced}) => {
            if (isSynced) {
                onLiveOrderEvent(items)
            }
        })
    }

    function subscribeToCompletedOrders() {
        subscription.completedOrders = DataStore.observeQuery(Order, o => o.and(o => [
            o.customerID.eq(dbCustomer.id),
            o.isDeleted.eq(false),
            o.or(o => [
                o.status.eq("COMPLETED"),
                o.status.eq("DECLINED")
            ])
        ])).subscribe(({items, isSynced}) => {
            if (isSynced) {
                setCompletedOrders(items)
            }
        })
    }

    function reSubscribeToLiveOrders() {
        subscription?.liveOrders && subscription.liveOrders.unsubscribe()
        subscribeToLiveOrders()

    }


    useEffect(() => {
        if (countUpdates === 0) return;

        /**
         * remove completed order
         */

        liveOrders.length && liveOrders.some(liveOrder => {
            if (liveOrder.status === "COMPLETED" || liveOrder.status === "DECLINED") {
                setCompletedOrders(prev => [...prev, {...liveOrder}])
                reSubscribeToLiveOrders()
                return true
            }
        })


    }, [countUpdates])


    function checkIfPriceIsValid({totalPrice}) {
        if (totalPrice && totalPrice > restaurant?.deliveryFee) {
            console.log("price is valid!")
            return true
        } else {
            console.error("price isn't valid! please fix it!", totalPrice)
            return false
        }
    }


    function clearBasket() {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ clearing the basket  ~~~~~~~~~~~~~~~~~~~~~ :")

        setBasketDishes([])
        setTotalPrice(Number(restaurant.deliveryFee.toFixed(2)))
        setTotalBasketQuantity(0)
    }


    async function assignDishToOrder(dish, newOrder) {
        return await DataStore.save(Dish.copyOf(await DataStore.query(Dish, dish.id), updated => {
                    updated.orderID = newOrder.id
                    updated.basketID = 'null'
                }
            )
        )
    }

    async function assignDishesToOrder(dishes, newOrder) {

        const assignedDishes = []

        for await(const dish of dishes) {
            assignedDishes.push(await assignDishToOrder(dish, newOrder))
        }

        setOrderDishes(assignedDishes)

    }

    function checkIfLiveOrderIsExisting() {
        return liveOrders.length > 0;
    }

    const createNewOrder = async () => {

        if (checkIfLiveOrderIsExisting()) {
            Alert.alert("you cannot create more than one order at once")
            return;
        }
        if (!checkIfPriceIsValid({totalPrice})) {
            Alert.alert("please add items to the basket!")
            return;
        }

        /**
         create new Order:
         */
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~  create new Order:  restaurant?.id ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(restaurant?.id, null, 4))

        DataStore.save(new Order({
            status: "NEW",
            totalPrice: parseFloat(totalPrice),
            totalQuantity: basketDishes.reduce((count, dish) => count + dish.quantity, 0),
            restaurantLocation: restaurant.location,
            customerLocation: dbCustomer.location,
            isDeleted: false,
            customerID: dbCustomer.id,
            restaurantID: restaurant.id,
            dishes: basketDishes,
            courierID: "null"

        })).then(async newOrder => {

            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ newOrder ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(newOrder, null, 4))


            /**
             update Live Orders
             */
            reSubscribeToLiveOrders()

            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ before clearing the basket ~~~~~~~~~~~~~~~~~~~~~ :")


            /**
             move dishes from basket to the new order
             */
            assignDishesToOrder(basketDishes, newOrder).then(() => {

                /**
                 clear basket
                 */
                clearBasket()
            })

        })

    }

    const getOrderByID = async (id) => {
        const order = await DataStore.query(Order, o => o.and(o => [
            o.id.eq(id),
            o.isDeleted.eq(false)
        ]))
        return order?.[0]
    }

    const getStageByStatus = (status) => {

        switch (status) {


            case "NEW":
            case "DECLINED":
            case "COMPLETED":
                return 0


            case "ACCEPTED":
                return 1


            case "COOKING":
            case "READY_FOR_PICKUP":
                return 2


            case "PICKED_UP":
                return 3


            default:
                return -1
        }
    }

    return (
        <OrderContext.Provider value={{
            order,
            setOrder,
            orderDishes,
            liveOrders,
            completedOrders,
            countUpdates,
            liveCouriersIDs,
            createNewOrder,
            getOrderByID,
            getStageByStatus
        }}>
            {children}
        </OrderContext.Provider>
    )

}

export default OrderContextProvider

export const useOrderContext = () => useContext(OrderContext)
