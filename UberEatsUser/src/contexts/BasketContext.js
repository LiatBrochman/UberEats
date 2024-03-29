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
    // const [quantity, setQuantity] = useState(0)
    const [basket, setBasket] = useState(null)
    const [dish, setDish] = useState(null)


    function reSubscribeToAllDishes(basket) {
        subscription?.basketDishes?.unsubscribe()
        subscribeToAllDishes(basket)
    }

    function subscribeToAllDishes(basket) {

        subscription.basketDishes = DataStore.observeQuery(Dish, d => d.and(d => [
                d.basketID.eq(basket.id),
                d.isDeleted.eq(false)
            ]
        )).subscribe(({items, isSynced}) => {

            if (isSynced) {
            //     console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ setBasketDishes ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(items,null,4))

                setBasketDishes(items)
                setTotalPrice(Number(items.reduce((sum, dish) => sum + (dish.quantity * dish.price), restaurant.deliveryFee).toFixed(2)))
                setTotalBasketQuantity(items.reduce((sum, d) => sum + d.quantity, 0))
            }
        })
    }

    const addDishToBasket = async (dish) => {

        /**
         1.GET THE EXISTING BASKET \ CREATE NEW BASKET
         */
        const theBasket = await findExistingBasket(restaurant.id)
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ theBasket ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(theBasket, null, 4))


        /**
         2.CHECK IF THE DISH ALREADY EXISTS
         to check if a dish exists ,first we need to include all different (3 scenarios):


         -either the dish is brought from our basket (╹ڡ╹) , the user clicked ↑ or ↓ to increase/decrease its quantity)
         -either the dish is brought from the restaurant menu ○( ＾皿＾)っ ('add to basket' button) in that case the params of the dish contains stuff like quantity=999 and originID=null
         -either its deleted (x_x) (reviving it should eventually spend less storage and allow faster evaluations)
         */
        const [dishAlreadyExists] =
            await DataStore.query(Dish, d => d.and(d => [
                d.basketID.eq(theBasket.id),/**all must have the basketID of our basket*/

                d.or(d => [
                    d.originalID.eq(dish.id),/**either its an original dish (created by the owner of the restaurant)*/
                    d.id.eq(dish.id)/**either its an regular dish (created by us)*/

                ])/**ignoring 'isDeleted' with a good reason*/

            ]))


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

        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ dishAlreadyExists ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(dishAlreadyExists,null,4))
        switch (!!dishAlreadyExists) {

            case true:
                await DataStore.save(Dish.copyOf(dishAlreadyExists, updated => {
                    updated.name= dish.name
                    updated.price= dish.price
                    updated.image= dish.image
                    updated.description= dish.description
                    updated.quantity= dish.quantity
                    updated.restaurantID= dish.restaurantID
                    updated.isActive= true
                    updated.isDeleted= false
                    updated.originalID= dish.id + ''
                    updated.basketID= theBasket.id
                    updated.orderID= 'null'
                    // updated.quantity = dish.quantity
                    // updated.isDeleted = false
                }))
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

                // reSubscribeToAllDishes(theBasket)

                break;
        }

    }

    async function updateDishQuantity({dish, quantity}){
       await DataStore.save(Dish.copyOf(dish, updated => {updated.quantity = quantity}))
    }

    const removeDishFromBasket = async (dish) => {
        /**
         * remove dish from basket = deleting it from our basket
         * in order to do that we set its property (isDeleted=true), remove it from our context , and re-subscribe all of our basket dishes again
         */
        DataStore.save(
            Dish.copyOf(await dish, updated => {
                updated.isDeleted = true
            })
        ).then((dish) => {
            setDish(null)
            setTotalBasketQuantity(prevQuantity => prevQuantity - dish.quantity)
            // setQuantity(0)
            // reSubscribeToAllDishes(basket)
        })
    }

    const findExistingBasket = async (restaurantID = restaurant?.id) => {
        if (!restaurant?.id && !restaurantID) console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ !  !  ! findExistingBasket : restaurant?.id ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(restaurant?.id, null, 4))

        const [existingBasket] = await DataStore.query(Basket, b => b.and(b => [
            b.restaurantID.eq(restaurantID),
            b.customerID.eq(dbCustomer.id),
            b.isDeleted.eq(false)
        ]))

        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ !!existingBasket ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(!!existingBasket, null, 4))
        switch (!!existingBasket) {

            case true:
                setBasket(existingBasket)
                return existingBasket


            case false:
                return await createNewBasket(restaurantID)
        }
    }

    const createNewBasket = async (restaurantID) => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ createNewBasket:  restaurantID ~~~~~~~~~~~~~~~~~~~~~ :", restaurantID )

        const createdBasket = await DataStore.save(new Basket({
            customerID: dbCustomer?.id,
            restaurantID: restaurantID,
            isDeleted: false
        }))

        setBasket(createdBasket)
        return createdBasket
    }

    async function getBasketByRestaurantID(restaurantID){
       return await DataStore.query(Basket, b => b.and(b => [
            b.restaurantID.eq(restaurantID),
            b.customerID.eq(dbCustomer.id),
            b.isDeleted.eq(false)
        ])).then(([basket])=> basket)
           .catch(e=>console.error("getBasketByRestaurantID:",e))
    }

    function switchToAnotherBasket(restaurant){

        getBasketByRestaurantID(restaurant.id).then(existingBasket => {
                existingBasket?.length && setBasket(existingBasket[0])
            })
    }

    /**
     set dishes (of basket)
     set total price
     set total basket quantity
     */

    useEffect(() => {
        if(!restaurant) return;

        switchToAnotherBasket(restaurant)
    }, [restaurant])


    useEffect(()=>{
        if (!basket) return;

        reSubscribeToAllDishes(basket)
    },[basket])


    return (<BasketContext.Provider
            value={{
                addDishToBasket,
                removeDishFromBasket,
                findExistingBasket,
                updateDishQuantity,

                basket,
                setBasket,

                basketDishes,
                setBasketDishes,

                setTotalPrice,
                totalPrice,

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
