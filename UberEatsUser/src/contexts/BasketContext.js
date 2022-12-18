import {createContext, useState, useEffect, useContext} from "react";
import {DataStore} from "aws-amplify";
import {Basket, Dish, Restaurant} from "../models";
import {useAuthContext} from "./AuthContext";
import {useRestaurantContext} from "./RestaurantContext";

const BasketContext = createContext({});

const BasketContextProvider = ({children}) => {

    const getBasketFromDB = async ({dbCustomer, restaurant}) => {
        const [getBasketFromDB] = await DataStore.query(Basket, b =>
            b.and(b => [
                b.restaurantID.eq(restaurant?.id),
                b.customerID.eq(dbCustomer?.id)
            ]))
        // .subscribe(snapshot => {
        //     console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ snapshot ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(snapshot,null,4))
        // const { items, isSynced } = snapshot
        // console.log(`[Snapshot] item count: ${items.length}, isSynced: ${isSynced}`)
        // })

        // const [getBasketFromDB] = await DataStore.query(Basket, b =>
        //     b.and(b => [
        //         b.restaurantID.eq(restaurant?.id),
        //         b.customerID.eq(dbCustomer?.id)
        //     ]))
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ getBasketFromDB ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(getBasketFromDB, null, 4))
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ getBasketFromDB.dishes: ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(getBasketFromDB?.Dishes, null, 4))

        return getBasketFromDB
    }
    // const getDishes_ByCustomer= async ({dbCustomer}) => {
    //     return await DataStore.query(Dish, d => d.basketID.eq(dbCustomer?.id))
    // }
    const getDishes_ByBasket = async ({basket}) => {
        return await DataStore.query(Dish, d => d.basketID.eq(basket?.id))
    }
    const getTotalPrice = ({dishes, restaurant}) => {

        if (!dishes) return 0

        let totalPrice_calc = restaurant.deliveryFee

        dishes.forEach(dish => totalPrice_calc += dish.price)

        return (typeof totalPrice_calc === "number") && totalPrice_calc.toFixed(2)

        // return dishes.reduce(
        //     async (sum, dish) => {
        //
        //         return await DataStore.query(Dish, d => d.id.eq(basketDish.basketDishDishId))
        //             .then(([dish])=>{
        //             console.log("dish price=", Number(dish.price))
        //             console.log("basketDish.quantity=", Number(basketDish.quantity))
        //             console.log("sum=", sum)
        //             if(sum.hasOwnProperty('_z')) sum=sum['_z']
        //             console.log(sum)
        //             // console.log("\n\n\n######## basket dish is:",basketDish)
        //             // // console.log("\n\n\n@@@@@@@@ DISH :",basketDish.Dish)
        //             // console.log("\n\n\n@@@@@@@@ DISH query :", await DataStore.query(Dish, d=> d.id.eq(basketDish.basketDishDishId)))
        //             const res = sum + basketDish.quantity * dish.price
        //             console.log("calc",res)
        //             return res
        //         })
        //     }
        //     , restaurant?.deliveryFee)
    }
    const getDish_ByID = async id => {
        // const res =
        return await DataStore.query(Dish, id)
        // return (res instanceof Array ? [res] : res)
    }
    const getBasketSize = () => {
        return dishes?.length
    }
    const {dbCustomer} = useAuthContext()
    const {restaurant} = useRestaurantContext()

    // const [restaurant, setRestaurant] = useState()
    const [basket, setBasket] = useState()
    const [dishes, setDishes] = useState()
    const [totalPrice, setTotalPrice] = useState()

    const clearBasketContext = () => {
        setRestaurant(null)
        setBasket(null)
        setDishes(null)
        setTotalPrice(0)
    }


    useEffect(() => {
        restaurant && !basket && getBasketFromDB({dbCustomer, restaurant}).then(setBasket)
        // restaurant && !basket && getDishes_ByRestaurant({restaurant}).then(setDishes)
        // if (restaurant && !basket) {
        // (async () => {
        //     const data = await getBasketFromDB({dbCustomer, restaurant})
        //     if (data) {
        //         setBasket(data)
        //     }
        // })()
        // }
    }, [restaurant])
    // useEffect(() => {
    //     basket && !dishes && getDishes_ByRestaurant({basket}).then(ds=>{
    //         setDishes(ds)
    //         console.log("\n\n ds:",ds)
    //     })
    useEffect(() => {
        basket && !dishes && getDishes_ByBasket({basket}).then(customerDishes => {
            setDishes(customerDishes)
            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ customerDishes ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(customerDishes, null, 4))
        })

    }, [basket])

    useEffect(() => {
        dishes && !totalPrice && setTotalPrice(getTotalPrice({dishes, restaurant}))
        // (async () =>{
        //     if (dishes) {
        //         const data =  await getTotalPrice({dishes, restaurant})
        //         if (data) {
        //             console.log("\n\n\nsetting total price: " + data)
        //             try{
        //                 console.log(data.toFixed(2))
        //             }catch (e) {
        //                 console.error(e)
        //             }
        //             setTotalPrice(data)
        //         }
        //     }
        // })()

    }, [dishes])


    async function checkIfDishAlreadyExists({dish, basket, restaurant}) {

        const [existingDish] = await DataStore.query(Dish, d =>
            d.and(d => [
                d.basketID.eq(basket.id),
                d.originalID.eq(dish.id)
                // basket.id.eq(d.basketID),
                // dish.id.eq(d.originalID),
            ]))
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~checkIfDishAlreadyExists() ---> existingDish ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(existingDish, null, 4))

        return existingDish
    }

    const addDishToBasket = async (dish) => {
        console.log("\n\n starting addDishToBasket()!")

        //get the existing basket or create a new one
        let theBasket = basket || await createNewBasket()

        const dishAlreadyExists = checkIfDishAlreadyExists({dish, basket: theBasket})

        if (dishAlreadyExists instanceof Dish) {
            //the customer is trying to add a new dish but it already exists in his basket.
            //in this case we update the corresponding dish's quantity only.
            await DataStore.save(Dish.copyOf(await dishAlreadyExists, updated => {
                updated.quantity = dish.quantity
            }))
            setDishes(prevDishes => prevDishes.map(prevDish => {
                    if (prevDish.originalID === dish.id) {
                        prevDish.quantity = dish.quantity
                    }
                    return prevDish
                })
            )

        } else {
            //the customer is trying to add a new dish to his basket.
            //in this case we need to create a new dish with the relevant arguments.
            const newDish = {
                name: dish.name,
                price: dish.price,
                image: dish.image,
                description: dish.description,
                quantity: dish.quantity,
                restaurantID: dish.restaurantID,
                basketID: theBasket.id,
                isActive: true,
                isDeleted: false,
                originalID: dish.id + ""
            }
            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ newDish ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(newDish, null, 4))
            const newDishFromDB = await DataStore.save(new Dish(newDish))
            setDishes([...dishes, newDishFromDB])
        }
    }

    const createNewBasket = async () => {
        let theBasket = getBasketFromDB({dbCustomer, restaurant})
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ theBasket ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(theBasket, null, 4))

        if (!(theBasket instanceof Basket)) {
            theBasket = await DataStore.save(new Basket({
                customerID: dbCustomer?.id,
                restaurantID: restaurant?.id,
                isDeleted: false
            }))
        }
        setBasket(theBasket)
        return theBasket
    }

    const removeDishFromBasket = async ({dish}) => {
        const existingDish = await DataStore.query(Dish, dish.id)
        if (existingDish) {
            await DataStore.save(
                Dish.copyOf(existingDish, updated => {
                    updated.isDeleted = true
                })
            )
            setDishes(prevDishes => {
                    // return prevDishes.map(prevDish => prevDish.id === dish.id ? ((prevDish.isDeleted = true) && prevDish) : prevDish)
                    prevDishes.find(prevDish => prevDish.id === dish.id).isDeleted = true
                    return prevDishes
                }
            )
        }
    }

    return (<BasketContext.Provider
            value={{
                addDishToBasket,
                clearBasketContext,
                removeDishFromBasket,
                getDishes_ByBasket,
                getDish_ByID,
                getBasketSize,

                basket,
                setBasket,

                dishes,
                setDishes,


                setTotalPrice,
                totalPrice
            }}
        >
            {children}
        </BasketContext.Provider>
    );
};

export default BasketContextProvider;

export const useBasketContext = () => useContext(BasketContext);