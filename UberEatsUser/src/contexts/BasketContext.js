import {createContext, useState, useEffect, useContext} from "react";
import {Amplify, DataStore} from "aws-amplify";
import {Basket, Dish} from "../models";
import {useAuthContext} from "./AuthContext";
import {useRestaurantContext} from "./RestaurantContext";
import {
    getBasket_DB,
    getDishes_ByBasket,
    getTotalPrice,
    getDish_ByID,
    createNewBasket_DB,
    updateDishQuantity_DB,
    createNewDish_DB,
    removeDish_DB
} from "./Queries";

import {useNavigation, useRoute} from "@react-navigation/native";
import {subscription} from "../screens/HomeScreen";

const BasketContext = createContext({});

const BasketContextProvider = ({children}) => {

        const {dbCustomer} = useAuthContext()
        const {restaurant} = useRestaurantContext()
        const [basket, setBasket] = useState()
        const [basketDishes, setBasketDishes] = useState([])
        const [totalPrice, setTotalPrice] = useState(0)
        const [totalBasketQuantity, setTotalBasketQuantity] = useState(0)
        const [quantity, setQuantity] = useState(0)
        const [dish, setDish] = useState()

        // const subscriptionMap = {
        //     basket: async () =>
        //         await DataStore.observeQuery(Basket, b => b.and(b => [
        //             b.restaurantID.eq(restaurant?.id),
        //             b.customerID.eq(dbCustomer?.id),
        //             b.isDeleted.eq(false)]
        //         )).subscribe(basket => {
        //             setBasket(basket?.items?.[0])
        //             // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ sub of basket ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(basket.items[0], null, 4))
        //         }),
        //     dishes: async () =>
        //         await DataStore.observeQuery(Dish, d => d.and(d => [
        //                 d.basketID.eq(basket?.id),
        //                 d.isDeleted.eq(false)
        //             ]
        //         )).subscribe(basket_dishes => {
        //
        //             if (basket_dishes?.items && basket_dishes?.items?.length) {
        //
        //                 setDishes(basket_dishes.items)
        //
        //                 setTotalPrice(Number(basket_dishes.items.reduce((sum, dish) => sum + (dish.quantity * dish.price), restaurant.deliveryFee).toFixed(2)))
        //
        //                 setTotalBasketQuantity(basket_dishes.items.reduce((sum, d) => sum + d.quantity, 0))
        //
        //                 console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ sub of dishes ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(basket_dishes.items[0], null, 4))
        //
        //             }
        //         }),
        //     dish: async (newDishFromDB) =>
        //         await DataStore.observe(Dish, newDishFromDB.id).subscribe(dish => {
        //             if (dish?.items) {
        //                 setDish(dish.items[0])
        //                 setQuantity(dish.items[0].quantity)
        //                 console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ sub of new dish ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(dish.items[0], null, 4))
        //             }
        //         })
        // }

        // const startSubscription = {
        //     basket: (() =>
        //             subscriptionMap.basket = Amplify.DataStore.observeQuery(Basket, b => b.and(b => [
        //                 b.restaurantID.eq(restaurant?.id),
        //                 b.customerID.eq(dbCustomer?.id),
        //                 b.isDeleted.eq(false)]
        //             )).subscribe(basket => {
        //                 setBasket(basket?.items?.[0])
        //                 console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ sub of basket ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(basket.items, null, 4))
        //             })
        //
        //     ),
        //     dishes: (() =>
        //         subscriptionMap.dishes = Amplify.DataStore.observeQuery(Dish, d => d.and(d => [
        //                 d.basketID.eq(basket?.id),
        //                 d.isDeleted.eq(false)
        //             ]
        //         )).subscribe(basket_dishes => {
        //
        //                 if (basket_dishes?.items?.length) {
        //
        //                     setDishes(basket_dishes.items)
        //
        //                     setTotalPrice(Number(basket_dishes.items.reduce((sum, dish) => sum + (dish.quantity * dish.price), restaurant.deliveryFee).toFixed(2)))
        //
        //                     setTotalBasketQuantity(basket_dishes.items.reduce((sum, d) => sum + d.quantity, 0))
        //
        //                     console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ sub of dishes ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(basket_dishes.items, null, 4))
        //
        //                 }
        //             }
        //         )),
        //     dish: ((newDishFromDB) =>
        //         subscriptionMap.dish = Amplify.DataStore.observeQuery(Dish, newDishFromDB.id).subscribe(dish => {
        //                 if (dish?.items?.quantity) {
        //                     setDish(dish.items)
        //                     setQuantity(dish.items.quantity)
        //                     console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ sub of new dish ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(dish.items, null, 4))
        //
        //                 }
        //             }
        //         ))
        //
        // }


        /**
         set basket
         */
        useEffect(() => {
            if (restaurant?.id && dbCustomer?.id)
                subscription.basket = DataStore.observeQuery(Basket, b => b.and(b => [
                        b.restaurantID.eq(restaurant.id),
                        b.customerID.eq(dbCustomer.id),
                        b.isDeleted.eq(false)
                    ])
                ).subscribe(({items}) => {
                   setBasket(items[0])
                })
            // restaurant && !basket && getBasket_DB({dbCustomer, restaurant}).then(setBasket)//todo
            // subscriptionMap.basket = Amplify.DataStore.observeQuery(Basket, b =>
            //     b.and(b => [
            //         b.restaurantID.eq(restaurant?.id),
            //         b.customerID.eq(dbCustomer?.id),
            //         b.isDeleted.eq(false)
            //     ])).subscribe(basket => {
            //     setBasket(basket?.items?.[0])
            // })
            // if (restaurant) {
            //     (async () => {
            //
            //             if (!basket) {
            //                 await createNewBasket()
            //                 await subscriptionMap.basket()
            //
            //             } else {
            //                 await subscriptionMap.basket()
            //             }
            //         }
            //     )()
            //
            // }
        }, [restaurant])

        /**
         set dishes (of basket)
         set total price
         set total basket quantity
         */
        useEffect(() => {
            if (basket?.id)
                subscription.basketDishes = DataStore.observeQuery(Dish, d => d.and(d => [
                        d.basketID.eq(basket.id),
                        d.isDeleted.eq(false)
                    ]
                )).subscribe(({items}) => {

                        setBasketDishes(items)
                        setTotalPrice(Number(items.reduce((sum, dish) => sum + (dish.quantity * dish.price), restaurant.deliveryFee).toFixed(2)))
                        setTotalBasketQuantity(items.reduce((sum, d) => sum + d.quantity, 0))

                })
            // basket && !dishes && getDishes_ByBasket({basket}).then(customerDishes => {
            //     //console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ customerDishes ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(customerDishes, null, 4))
            //     setDishes(customerDishes)//todo dont delete!
            // if (basket?.id && !dishes) {
            //
            //     subscriptionMap.dishes()

            // subscriptionMap.dishes = Amplify.DataStore.observeQuery(Dish, d =>
            //     d.and(d => [
            //             d.basketID.eq(basket.id),
            //             d.isDeleted.eq(false)
            //         ]
            //     )
            // ).subscribe(basket_dishes => {
            //
            //     basket_dishes?.items?.length &&
            //
            //     setDishes(basket_dishes.items)
            //
            //     setTotalPrice(Number(basket_dishes.items.reduce(
            //         (sum, dish) => sum + (dish.quantity * dish.price), restaurant.deliveryFee).toFixed(2)))
            //
            //     setTotalBasketQuantity(basket_dishes.items.reduce((sum, d) => sum + d.quantity, 0))
            //
            // })

            // }
        }, [basket])

        // const getTotalPrice = (dishes) => {
        //
        //     if (dishes?.length && restaurant?.deliveryFee) {
        //
        //         let totalPrice_calc = restaurant.deliveryFee
        //
        //         dishes.forEach(dish => totalPrice_calc += dish.price * dish.quantity)
        //
        //         return (typeof totalPrice_calc === "number") && totalPrice_calc.toFixed(2)
        //     }
        // }
        // useEffect(() => {
        //dishes && setTotalPrice(getTotalPrice({dishes, restaurant}))//todo
        // }, [dishes])

        const checkIfDishAlreadyExists = async ({dish, basket}) => {
            if (!basket) return null
            const existingDish = await DataStore.query(Dish, d =>
                d.and(d => [
                    d.basketID.eq(basket.id),
                    d.isDeleted.eq(false),

                    // XXXX d.id.eq(dish.id),

                    d.or(d => [
                        // if its a customer dish:
                        d.id.eq(dish.id),

                        //if its a restaurant dish:
                        d.originalID.eq(dish.id),
                    ])

                ])).then(res => {
                console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ res of checkIfDishAlreadyExists ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(res, null, 4))
                return res

            })

            //console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~checkIfDishAlreadyExists() ---> existingDish ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(existingDish, null, 4))
            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ existingDish?.[0] ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(existingDish?.[0], null, 4))

            return existingDish?.[0]
        }

        const addDishToBasket = async ({dish}) => {
            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ before addDishToBasket(dish) ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(dish, null, 4))


            /**
             GET THE EXISTING BASKET \ CREATE NEW BASKET
             */
            const theBasket = basket || await createNewBasket()
            // if (!(basket?.id)) {
            //     if (dbCustomer && restaurant) {
            //         const newBasket = await DataStore.save(new Basket({
            //             customerID: dbCustomer?.id,
            //             restaurantID: restaurant?.id,
            //             isDeleted: false
            //         }))
            //
            //         subscription.basket = DataStore.observeQuery(Basket, b => b.id.eq(newBasket.id))
            //             .subscribe(({items}) => {
            //                 items?.[0] && setBasket(items[0])
            //             })
            //
            //
            //
            //
            //     }
            //
            // } else {
            //     console.error("\n\nUnable to create new basket!! \nreason: ")
            //     !dbCustomer && console.error("customer id isn't valid")
            //     !restaurant && console.error("restaurant id isn't valid")
            //     return null
            // }


            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ theBasket ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(theBasket, null, 4))

            /**
             CHECK IF THE DISH ALREADY EXISTS
             */
            const dishAlreadyExists =
                await DataStore.query(Dish, d => d.and(d => [
                    d.basketID.eq(theBasket.id),
                    d.or(d => [
                        d.originalID.eq(dish.id),
                        d.id.eq(dish.id)
                    ])
                ])).then(res => res?.[0])
            // basketDishes.find(d => d.originalID === dish.id || d.id===dish.id)
            //const dishAlreadyExists = await checkIfDishAlreadyExists({dish, basket: theBasket})
            //console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ dishAlreadyExists ?? ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(dishAlreadyExists, null, 4))

            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ dishAlreadyExists ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(dishAlreadyExists, null, 4))

            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ dishAlreadyExists :", !!dishAlreadyExists, ",isDeleted :", dishAlreadyExists?.isDeleted)


            let newDish;


            /**
             * IF THE DISH ALREADY EXISTS: update dish quantity
             * IF THE DISH ALREADY EXISTS (deleted dish): update dish quantity dish isDeleted to false
             * OTHERWISE CREATE A NEW DISH
             */
            switch (!!dishAlreadyExists) {

                case true:
                    newDish = await DataStore.save(Dish.copyOf(dishAlreadyExists, updated => {
                        updated.quantity = dish.quantity
                        updated.isDeleted = false
                    }))
                    break;

                case false:
                    newDish = await DataStore.save(new Dish({
                        name: dish.name,
                        price: dish.price,
                        image: dish.image,
                        description: dish.description,
                        quantity: dish.quantity,
                        restaurantID: dish.restaurantID,
                        isActive: true,
                        isDeleted: false,
                        originalID: dish.id + '',
                        basketID: theBasket.id,
                        orderID: 'null',
                    }))
                    break;
            }

            if (subscription?.basketDishes) subscription.basketDishes.unsubscribe()

            subscription.basketDishes = DataStore.observeQuery(Dish, d => d.and(d => [
                    d.basketID.eq(theBasket.id),
                    d.isDeleted.eq(false)
                ]
            )).subscribe(({items}) => {

                    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~on add subscription?.basketDishes ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(subscription?.basketDishes,null,4))
                    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ items ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(items,null,4))

                    setBasketDishes(items)
                    setTotalPrice(Number(items.reduce((sum, dish) => sum + (dish.quantity * dish.price), restaurant.deliveryFee).toFixed(2)))
                    setTotalBasketQuantity(items.reduce((sum, d) => sum + d.quantity, 0))

            })


            // //IF THE DISH ALREADY EXISTS: update dish quantity
            // if (dishAlreadyExists && dishAlreadyExists.isDeleted===false) {
            //     await DataStore.save(Dish.copyOf(dishAlreadyExists, updated => {
            //         updated.quantity = dish.quantity
            //     })).then(() => {
            //
            //
            //         if (subscription?.basketDishes) subscription.basketDishes.unsubscribe()
            //
            //         subscription.basketDishes = DataStore.observeQuery(Dish, d => d.and(d => [
            //                 d.basketID.eq(basket.id),
            //                 d.isDeleted.eq(false)
            //             ]
            //         )).subscribe(({items}) => {
            //             if (items?.length) {
            //                 setBasketDishes(items)
            //                 setTotalPrice(Number(items.reduce((sum, dish) => sum + (dish.quantity * dish.price), restaurant.deliveryFee).toFixed(2)))
            //                 setTotalBasketQuantity(items.reduce((sum, d) => sum + d.quantity, 0))
            //             }
            //         })
            //     })
            //     //const updatedDish = await updateDishQuantity_DB({dish: dishAlreadyExists, quantity: dish.quantity})
            //
            //     // setDishes(dishes =>
            //     //     dishes.map(d =>
            //     //         d.originalID === dish.id
            //     //             ? (
            //     //                 setQuantity(prevQuantity => prevQuantity - d.quantity + updatedDish.quantity) &&
            //     //                 updatedDish
            //     //             )
            //     //             : d
            //     //     )
            //     // )//todo dont delete
            // }
            // if (dishAlreadyExists && dishAlreadyExists.isDeleted===true) {
            //         await DataStore.save(Dish.copyOf(dishAlreadyExists, updated => {
            //             updated.quantity = dish.quantity
            //             updated.isDeleted = false
            //         })).then(() => {
            //
            //
            //             if (subscription?.basketDishes) subscription.basketDishes.unsubscribe()
            //
            //             subscription.basketDishes = DataStore.observeQuery(Dish, d => d.and(d => [
            //                     d.basketID.eq(basket.id),
            //                     d.isDeleted.eq(false)
            //                 ]
            //             )).subscribe(({items}) => {
            //                 if (items?.length) {
            //                     setBasketDishes(items)
            //                     setTotalPrice(Number(items.reduce((sum, dish) => sum + (dish.quantity * dish.price), restaurant.deliveryFee).toFixed(2)))
            //                     setTotalBasketQuantity(items.reduce((sum, d) => sum + d.quantity, 0))
            //                 }
            //             })
            //         })
            //     }
            // //CREATE A NEW DISH
            // else {
            //     await DataStore.save(new Dish({
            //         name: dish.name,
            //         price: dish.price,
            //         image: dish.image,
            //         description: dish.description,
            //         quantity: dish.quantity,
            //         restaurantID: dish.restaurantID,
            //         isActive: true,
            //         isDeleted: false,
            //         originalID: dish.id + '',
            //         basketID: theBasket.id,
            //         orderID: 'null',
            //     })).then(newDish => {
            //
            //
            //         if (subscription?.basketDishes) subscription.basketDishes.unsubscribe()
            //
            //         subscription.basketDishes = DataStore.observeQuery(Dish, d => d.and(d => [
            //                 d.basketID.eq(basket.id),
            //                 d.isDeleted.eq(false)
            //             ]
            //         )).subscribe(({items}) => {
            //             if (items?.length) {
            //                 setBasketDishes(items)
            //                 setTotalPrice(Number(items.reduce((sum, dish) => sum + (dish.quantity * dish.price), restaurant.deliveryFee).toFixed(2)))
            //                 setTotalBasketQuantity(items.reduce((sum, d) => sum + d.quantity, 0))
            //             }
            //         })
            //     })
            //
            //     //const newDishFromDB = await createNewDish_DB({dish, basket: theBasket})
            //     //subscriptionMap.dish_unsub = await subscriptionMap.dish(newDishFromDB)
            //     // subscriptionMap.dish = DataStore.observe(Dish,newDishFromDB.id).subscribe(({items}) => {
            //     //     setDish(items)
            //     //     setQuantity(items.quantity)
            //     // })
            //     // setDishes([...dishes, newDishFromDB])
            // }
        }

        const createNewBasket = async () => {
            return getBasket_DB({dbCustomer, restaurant}).then(existingBasket => {


                switch (!!existingBasket) {

                    case true:
                        subscription.basket = DataStore.observeQuery(Basket, b => b.id.eq(existingBasket.id))
                            .subscribe(({items}) => {
                               setBasket(items[0])
                            })
                        return existingBasket


                    case false:
                        return createNewBasket_DB({dbCustomer, restaurant}).then(theBasket => {
                            subscription.basket = DataStore.observeQuery(Basket, b => b.id.eq(theBasket.id))
                                .subscribe(({items}) => {
                                    setBasket(items[0])
                                })
                            return theBasket
                        })

                }

            })
        }

        const removeDishFromBasket = async ({dish}) => {

            DataStore.save(
                Dish.copyOf(await dish, updated => {
                    updated.isDeleted = true
                })
            ).then(removedDish => {
                // setDishes(prev => prev.filter(d => d.id !== dish.id))
                // setTotalPrice(prev => prev - (dish.quantity * dish.price))
                // setTotalBasketQuantity(prev => prev - quantity)

                setDish(null)
                setQuantity(0)

                /**
                 update basketDishes listener
                 */

                if (subscription?.basketDishes) subscription.basketDishes.unsubscribe()


                subscription.basketDishes = DataStore.observeQuery(Dish, d => d.and(d => [
                        d.basketID.eq(basket.id),
                        d.isDeleted.eq(false)
                    ]
                )).subscribe(({items}) => {

                        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ setBasketDishes items:~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(items,null,4))
                        setBasketDishes(items)
                        setTotalPrice(Number(items.reduce((sum, dish) => sum + (dish.quantity * dish.price), restaurant.deliveryFee).toFixed(2)))
                        setTotalBasketQuantity(items.reduce((sum, d) => sum + d.quantity, 0))

                })
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ removed Dish ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(removedDish,null,4))

            })
        }
// const existingDish = await getDish_ByID({id: dish.id})
// if (existingDish instanceof Dish) {
// await removeDish_DB({dish: existingDish})
// setDishes(ds => {
//     ds.filter(d => d.id !== dish.id)
// })
// setQuantity(prev => prev - dish.quantity)

        const getExistingDishQuantity = async ({basket, dish}) => {
            if (!basket) return 0
            const result = await DataStore.query(Dish, d =>
                d.and(d =>
                    [
                        d.originalID.eq(dish.id),
                        d.basketID.eq(basket.id),
                        d.isDeleted.eq(false)
                    ]
                ))
            return result[0].quantity
        }

        return (<BasketContext.Provider
                value={{
                    addDishToBasket,
                    getExistingDishQuantity,
                    removeDishFromBasket,
                    getDishes_ByBasket,
                    getDish_ByID,

                    basket,
                    setBasket,

                    basketDishes,
                    setBasketDishes,

                    setTotalPrice,
                    totalPrice,

                    quantity,
                    setQuantity,

                    dish,
                    setDish,

                    totalBasketQuantity

                }}
            >
                {children}
            </BasketContext.Provider>
        );
    }
;

export default BasketContextProvider;

export const useBasketContext = () => useContext(BasketContext);
