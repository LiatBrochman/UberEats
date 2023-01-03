import {createContext, useState, useEffect, useContext} from "react";
import {DataStore} from "aws-amplify";
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

const BasketContext = createContext({});

const BasketContextProvider = ({children}) => {

    const {dbCustomer} = useAuthContext()
    const {restaurant} = useRestaurantContext()
    const [basket, setBasket] = useState()
    const [dishes, setDishes] = useState()
    const [totalPrice, setTotalPrice] = useState()
    const [quantity,setQuantity] = useState(1)
    const [dish,setDish] = useState()



    useEffect(() => {
        restaurant && !basket && getBasket_DB({dbCustomer, restaurant}).then(setBasket)
    }, [restaurant])

    useEffect(() => {
        basket && !dishes && getDishes_ByBasket({basket}).then(customerDishes => {
            //console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ customerDishes ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(customerDishes, null, 4))
            setDishes(customerDishes)
        })

    }, [basket])

    useEffect(() => {
        dishes && setTotalPrice(getTotalPrice({dishes, restaurant}))
    }, [dishes])

    const checkIfDishAlreadyExists = async ({dish, basket}) => {

        const [existingDish] = await DataStore.query(Dish, d =>
            d.and(d => [
                d.basketID.eq(basket.id),
                d.originalID.eq(dish.id),
                d.isDeleted.eq(false)
            ]))

        //console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~checkIfDishAlreadyExists() ---> existingDish ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(existingDish, null, 4))

        return existingDish
    }

    const addDishToBasket = async ({dish}) => {

        //GET THE EXISTING BASKET \ CREATE NEW BASKET
        let theBasket = basket || await createNewBasket()

        //CHECK IF THE DISH ALREADY EXISTS
        const dishAlreadyExists = await checkIfDishAlreadyExists({dish, basket: theBasket})

        //IF THE DISH ALREADY EXISTS: update dish quantity
        if (dishAlreadyExists instanceof Dish) {

            const updatedDish = await updateDishQuantity_DB({dish: dishAlreadyExists, quantity: dish.quantity})

            setDishes(dishes =>
                dishes.map(d =>
                    d.originalID === dish.id
                        ? updatedDish
                        : d
                )
            )
        }

        //CREATE A NEW DISH
        else {
            const newDishFromDB = await createNewDish_DB({dish, basket})
            setDishes([...dishes, newDishFromDB])
        }
    }

    const createNewBasket = async () => {
        let theBasket = getBasket_DB({dbCustomer, restaurant})
        if (!(theBasket instanceof Basket)) {
            theBasket = await createNewBasket_DB({dbCustomer, restaurant})
        }
        setBasket(theBasket)
        return theBasket
    }

    const removeDishFromBasket = async ({dish}) => {

        const existingDish = await getDish_ByID({id: dish.id})

        if (existingDish instanceof Dish) {

            await removeDish_DB({dish: existingDish})

            setDishes(ds => ds.filter(d => d.id !== dish.id))

        }
    }

    const getBasketSize = () => {
        return dishes?.length
    }

    const getExistingDishQuantity = async ({basket, dish}) => {
        const result= await DataStore.query(Dish, d =>
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
                getBasketSize,

                basket,
                setBasket,

                dishes,
                setDishes,

                setTotalPrice,
                totalPrice,

                quantity,
                setQuantity,

                dish,
                setDish

            }}
        >
            {children}
        </BasketContext.Provider>
    );
};

export default BasketContextProvider;

export const useBasketContext = () => useContext(BasketContext);
