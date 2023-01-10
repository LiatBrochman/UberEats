import {createContext, useContext, useState, useEffect} from "react";
import {DataStore} from "aws-amplify";
import {Dish, Order} from "../models";
import {useAuthContext} from "./AuthContext";
import {useBasketContext} from "./BasketContext";
import {useRestaurantContext} from "./RestaurantContext";
import {subscription} from "../screens/HomeScreen";

const OrderContext = createContext({})

const OrderContextProvider = ({children}) => {

    const {dbCustomer} = useAuthContext()
    const {restaurant} = useRestaurantContext()
    const {totalPrice, basketDishes , setBasketDishes ,setTotalPrice , setTotalBasketQuantity } = useBasketContext()
    const [order,setOrder] = useState({})
    const [orders, setOrders] = useState([])
    const [orderDishes, setOrderDishes] = useState([])


    /**
     init order context
     */
    useEffect(() => {
        /**
         listen to orders
         */
        if(dbCustomer?.id)
        subscription.orders = DataStore.observeQuery(Order, o => o.customerID.eq(dbCustomer.id)
        ).subscribe(({items}) => {
            setOrders(items)
        })
    },[dbCustomer])

    /**
     listen to current order's dishes
     */
    useEffect(()=>{
        if(order?.id) {
            if (subscription?.orderDishes) subscription.orderDishes.unsubscribe()
            subscription.orderDishes = DataStore.observeQuery(Dish, d => d.and(d => [
                    d.orderID.eq(order.id),
                    d.isDeleted.eq(false)
                ]
            )).subscribe(({items}) => {
                setOrderDishes(items)
            })
        }
    },[order])

    function checkIfPriceIsValid({totalPrice}) {
        if (totalPrice && totalPrice > restaurant?.deliveryFee) {
            console.log("price is valid!")
            return true
        } else {
            console.error("price isn't valid! please fix it!", totalPrice)
            return false
        }
    }


    const createOrder = async () => {

        if (checkIfPriceIsValid({totalPrice})) {

            /**
             create new Order:
             */
            await DataStore.save(new Order({
                status: "NEW",
                totalPrice: parseFloat(totalPrice),
                totalQuantity: basketDishes.reduce((count, dish) => count + dish.quantity, 0),
                restaurantLocation: restaurant.location,
                customerLocation: dbCustomer.location,
                isDeleted: false,
                customerID: dbCustomer.id,
                restaurantID: restaurant.id,
                dishes: basketDishes,
            })).then(async newOrder => {

                /**
                 set Orders
                 */
                if (subscription?.orders) subscription.orders.unsubscribe()
                subscription.orders = DataStore.observeQuery(Order, o => o.customerID.eq(dbCustomer.id)
                ).subscribe(({items}) => {
                   setOrders(items)
                })

                /**
                 stop listening to basketDishes
                 */
                subscription.basketDishes.unsubscribe()

                /**
                 clear basket
                 */
                setBasketDishes([])
                setTotalPrice(Number(restaurant.deliveryFee.toFixed(2)))
                setTotalBasketQuantity(0)

                /**
                 remove dishes from basket and create order dishes (by setting the basketID to null and the orderID to newOrder.id)
                 */
                const promises = basketDishes.map(async dish => await DataStore.save(
                        Dish.copyOf(dish, updated => {
                                updated.orderID = newOrder.id
                                updated.basketID = 'null'
                            }
                        )
                    )
                )

                Promise.allSettled(promises).then(() => {

                    /**
                     update OrderDishes
                     */
                    if(subscription?.orderDishes) subscription.orderDishes.unsubscribe()
                    subscription.orderDishes = DataStore.observeQuery(Dish, d => d.and(d => [
                            d.orderID.eq(newOrder.id),
                            d.isDeleted.eq(false)
                        ]
                    )).subscribe(({items}) => {
                         setOrderDishes(items)
                    })
                })
            })
        }
    }

    const getOrder = async (id) => {
        const order = await DataStore.query(Order, o => o.and(o => [
            o.id.eq(id),
            o.isDeleted.eq(false)
        ]))
        return order?.[0]
    }

    return (
        <OrderContext.Provider value={{
            createOrder,
            getOrder,
            orders,
            orderDishes,
            order,
            setOrder
        }}>
            {children}
        </OrderContext.Provider>
    );

};

export default OrderContextProvider

export const useOrderContext = () => useContext(OrderContext)
