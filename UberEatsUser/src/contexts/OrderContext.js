import {createContext, useContext, useState, useEffect} from "react";
import {DataStore} from "aws-amplify";
import {Dish, Order} from "../models";
import {useAuthContext} from "./AuthContext";
import {useBasketContext} from "./BasketContext";
import {useRestaurantContext} from "./RestaurantContext";
import {moveDishes_fromBasket_toOrder} from "./Queries";
import {subscription} from "../screens/HomeScreen";

const OrderContext = createContext({})

const OrderContextProvider = ({children}) => {

    const {dbCustomer} = useAuthContext()
    const {restaurant} = useRestaurantContext()
    const {totalPrice, basketDishes} = useBasketContext()
    const [orders, setOrders] = useState([])
    const [orderDishes, setOrderDishes] = useState([])

    useEffect(() => {
        dbCustomer &&
        DataStore.query(Order, o => o.customerID.eq(dbCustomer.id))
            .then(result => {
                if (!result) return null
                if (result instanceof Array) {
                    return result.filter(entity => entity.isDeleted === false)
                } else {
                    return result
                }
            })
            .then(existingOrders => {
                existingOrders instanceof Array &&
                existingOrders[0] instanceof Order &&
                setOrders(() => {
                    //console.log("\n\n ~~~~~~~~~ existingOrders ~~~~~~~~~ :", existingOrders)
                    return existingOrders
                })

            })
    }, [dbCustomer])

    function checkIfPriceIsValid({totalPrice}) {
        if (totalPrice && totalPrice > restaurant?.deliveryFee) {
            console.log("price is valid!")
            return true
        } else {
            console.error("price isn't valid! please fix it!", totalPrice)
            return false
        }
    }

    const updateDishOrderID_DB = async ({dish, order}) => {
        return await DataStore.save(Dish.copyOf(
            dish, updated => {
                updated.orderID = order.id
            }))
    }

    const createNewOrder_DB = async () => {
        //create the order
        return await DataStore.save(new Order({
            status: "NEW",
            totalPrice: parseFloat(totalPrice),
            totalQuantity: dishes.reduce((count, dish) => count + dish.quantity, 0),
            restaurantLocation: restaurant.location,
            customerLocation: dbCustomer.location,
            isDeleted: false,
            customerID: dbCustomer.id,
            restaurantID: restaurant.id,
            dishes: dishes,
        }))
    }

    // const updateDishes_DB = async({newOrder})=>{
    //     //every dish that is related to this order :: dish.orderID = this order id
    //     return dishes.map(async d => {
    //         const updatedDish = await updateDishOrderID_DB({dish:d, order:newOrder})
    //         console.log("\n\n ~~~~~~~~ updatedDish ~~~~~~~~~ :", updatedDish)
    //     })
    // }

    const createOrder = async () => {

        if (checkIfPriceIsValid({totalPrice})) {

            // const newOrder = await createNewOrder_DB()
            // setOrders(existingOrders => [...existingOrders, newOrder])

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
                subscription.orders = DataStore.observeQuery(Order, o => o.customerID.eq(dbCustomer.id)
                ).subscribe(({items}) => {
                    if (items?.length) setOrders(items)
                })

                /**
                 stop listening to basketDishes
                 */
                subscription.basketDishes.unsubscribe()


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
                     update OrderDishes listener
                     */
                    if(subscription?.orderDishes) subscription.orderDishes.unsubscribe()
                    subscription.orderDishes = DataStore.observeQuery(Dish, d => d.and(d => [
                            d.orderID.eq(newOrder.id),
                            d.isDeleted.eq(false)
                        ]
                    )).subscribe(({items}) => {
                        if (items?.length) setOrderDishes(items)
                    })
                })
            })

            // const dishesToUpdate = []
            // dishes.forEach(dish => {
            //
            //     dishesToUpdate.push(
            //         (async () => await DataStore.save(Dish.copyOf(await dish, updated => {
            //             updated.orderID: newOrder.id,
            //                 updated.basketID: "null"
            //         })))())
            //     dish,
            //         options: {
            //         orderID: order.id,
            //             basketID: "null"
            //     }
            // })
            // Promise.allSettled(dishesToUpdate).then(results => results.map(result => result?.value))


            // const updatedDishes = await updateDishes_DB({newOrder})
            // const updatedDishes = await moveDishes_fromBasket_toOrder({dishes,order:newOrder})
            // setDishes(updatedDishes)
            //console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ updatedDishes ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(updatedDishes,null,4))

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
            orderDishes
        }}>
            {children}
        </OrderContext.Provider>
    );

};

export default OrderContextProvider

export const useOrderContext = () => useContext(OrderContext)
