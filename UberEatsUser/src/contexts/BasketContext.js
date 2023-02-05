import {createContext, useContext, useEffect, useState} from "react";
import {DataStore} from "aws-amplify";
import {Basket, Dish} from "../models";
import {useAuthContext} from "./AuthContext";
import {useRestaurantContext} from "./RestaurantContext";
import {createNewBasket_DB, getBasket_DB, getDish_ByID, getDishes_ByBasket,} from "./Queries";


const BasketContext = createContext({})

const BasketContextProvider = ({children}) => {

    const {dbCustomer} = useAuthContext()
    const {restaurant} = useRestaurantContext()
    const [basket, setBasket] = useState()
    const [basketDishes, setBasketDishes] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalBasketQuantity, setTotalBasketQuantity] = useState(0)
    const [quantity, setQuantity] = useState(0)
    const [dish, setDish] = useState()


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
            ).subscribe(({items, isSynced}) => {
                isSynced && setBasket(items[0])
            })
        // return subscription?.basket?.unsubscribe()

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
            )).subscribe(({items, isSynced}) => {
                if (isSynced) {
                    setBasketDishes(items)
                    setTotalPrice(Number(items.reduce((sum, dish) => sum + (dish.quantity * dish.price), restaurant.deliveryFee).toFixed(2)))
                    setTotalBasketQuantity(items.reduce((sum, d) => sum + d.quantity, 0))
                }
            })

        // return subscription?.basketDishes?.unsubscribe()
    }, [basket])

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

        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ existingDish?.[0] ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(existingDish?.[0], null, 4))

        return existingDish?.[0]
    }

    const addDishToBasket = async ({dish}) => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ before addDishToBasket(dish) ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(dish, null, 4))


        /**
         GET THE EXISTING BASKET \ CREATE NEW BASKET
         */
        const theBasket = basket || await createNewBasket()

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
        )).subscribe(({items, isSynced}) => {

            // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~on add subscription?.basketDishes ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(subscription?.basketDishes, null, 4))
            // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ items ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(items, null, 4))
            if (isSynced) {
                setBasketDishes(items)
                setTotalPrice(Number(items.reduce((sum, dish) => sum + (dish.quantity * dish.price), restaurant.deliveryFee).toFixed(2)))
                setTotalBasketQuantity(items.reduce((sum, d) => sum + d.quantity, 0))
            }
        })
    }

    const createNewBasket = async () => {
        return getBasket_DB({dbCustomer, restaurant}).then(existingBasket => {


            switch (!!existingBasket) {

                case true:
                    subscription.basket = DataStore.observeQuery(Basket, b => b.id.eq(existingBasket.id))
                        .subscribe(({items, isSynced}) => {
                            isSynced && setBasket(items[0])
                        })
                    return existingBasket


                case false:
                    return createNewBasket_DB({dbCustomer, restaurant}).then(theBasket => {
                        subscription.basket = DataStore.observeQuery(Basket, b => b.id.eq(theBasket.id))
                            .subscribe(({items, isSynced}) => {
                                isSynced && setBasket(items[0])
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
            )).subscribe(({items, isSynced}) => {

                // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ setBasketDishes items:~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(items, null, 4))
                if (isSynced) {
                    setBasketDishes(items)
                    setTotalPrice(Number(items.reduce((sum, dish) => sum + (dish.quantity * dish.price), restaurant.deliveryFee).toFixed(2)))
                    setTotalBasketQuantity(items.reduce((sum, d) => sum + d.quantity, 0))
                }
            })
            // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ removed Dish ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(removedDish, null, 4))

        })
    }

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

                totalBasketQuantity,
                setTotalBasketQuantity
            }}
        >
            {children}
        </BasketContext.Provider>
    );
}


export default BasketContextProvider

export const useBasketContext = () => useContext(BasketContext)
