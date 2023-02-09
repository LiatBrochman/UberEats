import {createContext, useContext, useEffect, useState} from "react";
import {DataStore} from "aws-amplify";
import {Basket, Dish} from "../models";
import {useAuthContext} from "./AuthContext";
import {useRestaurantContext} from "./RestaurantContext";


const BasketContext = createContext({})

const BasketContextProvider = ({children}) => {

    const {dbCustomer} = useAuthContext()
    const {restaurant} = useRestaurantContext()
    const [basketDishes, setBasketDishes] = useState([])
    const [totalBasketQuantity, setTotalBasketQuantity] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)
    const [quantity, setQuantity] = useState(0)
    const [basket, setBasket] = useState(null)
    const [dish, setDish] = useState(null)


    /**
     set basket
     */
    useEffect(() => {
        if (restaurant?.id && dbCustomer?.id)
            DataStore.query(Basket, b => b.and(b => [
                    b.restaurantID.eq(restaurant.id),
                    b.customerID.eq(dbCustomer.id),
                    b.isDeleted.eq(false)
                ])
            ).then(existingBasket => {
                existingBasket?.length && setBasket(existingBasket[0])
            })

    }, [restaurant])

    /**
     set dishes (of basket)
     set total price
     set total basket quantity
     */
    useEffect(() => {
        if (basket)
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

    function reSubscribeToAllDishes() {
        subscription?.basketDishes && subscription.basketDishes.unsubscribe()
        subscribeToAllDishes()
    }

    function subscribeToAllDishes() {
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
    }

    const addDishToBasket = async ({dish}) => {

        /**
         1.GET THE EXISTING BASKET \ CREATE NEW BASKET
         */
        const theBasket = basket || await createNewBasket()


        /**
         2.CHECK IF THE DISH ALREADY EXISTS
         to check if a dish exists ,first we need to include all different (3 scenarios):


         -either the dish is brought from our basket (╹ڡ╹) , the user clicked ↑ or ↓ to increase/decrease its quantity)
         -either the dish is brought from the restaurant menu ○( ＾皿＾)っ ('add to basket' button) in that case the params of the dish contains stuff like quantity=999 and originID=null
         -either its deleted (x_x) (reviving it should eventually spend less storage and allow faster evaluations)
         */
        const dishAlreadyExists =
            await DataStore.query(Dish, d => d.and(d => [
                d.basketID.eq(theBasket.id),/**all must have the basketID of our basket*/

                d.or(d => [
                    d.originalID.eq(dish.id),/**either its an original dish (created by the owner of the restaurant)*/
                    d.id.eq(dish.id)/**either its an regular dish (created by us)*/

                ])/**ignoring 'isDeleted' with a good reason*/

            ])).then(res => res?.[0])


        /**
         * 3.(^_-)Switch-Case(-_^)
         *
         * IF THE DISH ALREADY EXISTS: update its quantity
         * IF THE DISH ALREADY EXISTS (but it is a deleted dish): bring it back to life + update its quantity + subscribe it
         * OTHERWISE CREATE A NEW DISH + subscribe it
         *
         *
         * keep in mind that:
         * if the dish wasn't existing \ the dish was deleted, we must add it to our subscription list!
         *  ............ only problem is, AWS doesnt support setting\updating subscriptions (observed queries) yet.
         *  therefore, were gonna have to re-subscribe them all again.... (•_•)
         */
        switch (!!dishAlreadyExists) {

            case true:
                DataStore.save(Dish.copyOf(dishAlreadyExists, updated => {
                    updated.quantity = dish.quantity
                    updated.isDeleted = false
                }))
                    .then(() => {
                        /**
                         * if the dish was deleted, we must add it to our subscription list (as mentioned before).
                         in order to make that happen, we need to make sure the new dish has been created in the DB.
                         the simplest way to make that happen is by waiting for the respond from the DataStore.
                         */
                        dishAlreadyExists.isDeleted && reSubscribeToAllDishes()
                    })
                break;

            case false:
                await DataStore.save(new Dish({
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

                reSubscribeToAllDishes()

                break;
        }

    }

    const createNewBasket = async () => {
        /**
         * verifying again , and then creating a new basket (subscription is unneeded since basket isn't suppose to change)
         */
        DataStore.query(Basket, b => b.and(b => [
            b.restaurantID.eq(restaurant?.id),
            b.customerID.eq(dbCustomer?.id),
            b.isDeleted.eq(false)
        ])).then(existingBasket => {

            if (existingBasket?.length > 0) {
                return setBasket(existingBasket[0])
            } else {
                return DataStore.save(new Basket({
                    customerID: dbCustomer?.id,
                    restaurantID: restaurant?.id,
                    isDeleted: false
                })).then(setBasket)
            }

        })
    }

    const removeDishFromBasket = async ({dish}) => {
        /**
         * remove dish from basket = deleting it from our basket
         * in order to do that we set its property (isDeleted=true), remove it from our context , and re-subscribe all of our basket dishes again
         */
        DataStore.save(
            Dish.copyOf(await dish, updated => {
                updated.isDeleted = true
            })
        ).then(() => {
            setDish(null)
            setQuantity(0)
            reSubscribeToAllDishes()
        })
    }


    return (<BasketContext.Provider
            value={{
                addDishToBasket,
                removeDishFromBasket,

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
