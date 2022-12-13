import {createContext, useState, useEffect, useContext} from "react";
import {DataStore} from "aws-amplify";
import {Basket, Dish, Restaurant} from "../models";
import {useAuthContext} from "./AuthContext";
import {useRestaurantContext} from "./RestaurantContext";

const BasketContext = createContext({});

const BasketContextProvider = ({children}) => {

    const getBasketFromDB = async ({dbCustomer, restaurant}) => {
        const [res] = await DataStore.query(Basket, b =>
            b.and(b => [
                b.restaurantID.eq(restaurant?.id),
                b.customerID.eq(dbCustomer?.id)
            ]))
        console.log("\n\n getBasketFromDB:", res)
        return res
    }
    // const getDishes_ByCustomer= async ({dbCustomer}) => {
    //     return await DataStore.query(Dish, d => d.basketID.eq(dbCustomer?.id))
    // }
    const getDishes_ByBasket = async ({basket}) => {
        return await DataStore.query(Dish, d => d.basketID.eq(basket?.id))
    }
    const getTotalPrice = ({dishes, restaurant}) => {

        if (!dishes) return 0

        let totalPrice = restaurant.deliveryFee

        dishes.forEach(dish => totalPrice += dish.price)


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
        basket && !dishes && getDishes_ByBasket({basket}).then(ds => {
            setDishes(ds)
            console.log("\n\n ds:", ds)
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


    function checkIfDishAlreadyExists({basket, restaurant}) {

        return undefined;
    }

    const addDishToBasket = async (dish) => {
        console.log("\n\n function addDishToBasket() has been called!")

        //get the existing basket or create a new one
        let theBasket = basket || await createNewBasket()

        const exists = checkIfDishAlreadyExists({basket:theBasket,restaurant})
        if(exists){//this updates the dish in the DB
            await DataStore.save(Dish.copyOf(exists,updated=>{
                updated.quantity = dish.quantity
            }))
        }else{
            const newDish = {
                name:dish.name,
                price:dish.price,
                image:dish.image,
                description:dish.description,
                quantity:dish.quantity,
                restaurantID:dish.restaurantID,
                basketID:theBasket.id,
                isActive:true,
                isDeleted:false,
            }
            console.log("\n\newDish:",newDish)
            await DataStore.save(new Dish(newDish))
            setDishes([...dishes, newDish])
        }
      }

    const createNewBasket = async () => {
        let theBasket = getBasketFromDB({dbCustomer, restaurant})
        console.log("\n\ntheBasket", theBasket)
        if (!theBasket) {
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