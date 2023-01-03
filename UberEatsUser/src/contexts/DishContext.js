import {createContext, useContext, useEffect, useState} from "react";
import {useRestaurantContext} from "./RestaurantContext";
import {
    getBasketDishes,
    getRestaurantDishes,
    getOrderDishes,
    updateDishQuantity_DB,
    createNewDish_DB,
    deleteDish_DB
} from "./Queries";
import {Restaurant, Basket, Order, Dish} from "../models";
import {useBasketContext} from "./BasketContext";
import {useOrderContext} from "./OrderContext";


const DishContext = createContext({})


const DishContextProvider = ({children}) => {


    const {restaurant} = useRestaurantContext()
    // const {basket, createNewBasket} = require("./BasketContext").useBasketContext()

    const {basket, createNewBasket} = useBasketContext()
    const {order} = useOrderContext()
    const [dish, setDish] = useState()
    const [restaurantDishes, setRestaurantDishes] = useState([])
    const [basketDishes, setBasketDishes] = useState([])
    const [orderDishes, setOrderDishes] = useState([])


    useEffect(() => {
        restaurant instanceof Restaurant && restaurantDishes?.length === 0 &&
        getRestaurantDishes({restaurant}).then(setRestaurantDishes)
    }, [restaurant])

    useEffect(() => {
        basket instanceof Basket && basketDishes?.length === 0 &&
        getBasketDishes({basket}).then(setBasketDishes)
    }, [basket])

    useEffect(() => {
        order instanceof Order && orderDishes?.length === 0 &&
        getOrderDishes({order}).then(setOrderDishes)
    }, [order])


    useEffect(() => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~DishContextProvider: basketDishes ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(basketDishes,null,4))

    }, [basketDishes])
    
    
    const addDishToBasket = async ({dish}) => {
        console.log("addDishToBasket() started!")
        // if(!(dish instanceof Dish)) {
        if (!(dish?.id && dish?.restaurantID && dish?.quantity && dish?.name && dish?.originalID)) {
            console.error("\n\n dish =", dish, ",on addDishToBasket()")
            return null
        }

        //GET THE EXISTING BASKET \ CREATE NEW BASKET
        let theBasket = basket || await createNewBasket()

        //CHECK IF THE DISH ALREADY EXISTS
        const dishAlreadyExists = basketDishes.find(d => d.originalID === dish.id)

        //IF THE DISH ALREADY EXISTS: update dish quantity
        if (dishAlreadyExists instanceof Dish) {
            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ found dish on dishAlreadyExists ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(dishAlreadyExists, null, 4))

            await updateDishQuantity({dish: dishAlreadyExists, quantity: dish.quantity})
        }

        //CREATE A NEW DISH
        else {
            await createNewDish({draftDish: dish})
        }
    }

    const updateDishQuantity = async ({dish, quantity}) => {
        const updatedDish = await updateDishQuantity_DB({dish, quantity})

        // setBasketDishes([...basketDishes.filter(d => d.id !== updatedDish.id),updatedDish])
        setBasketDishes(basketDishes =>
            basketDishes.map(prevDish =>
                prevDish.id === dish?.id
                    ? updatedDish
                    : prevDish
            )
        )
    }

    const createNewDish = async ({draftDish}) => {
        const newDish = await createNewDish_DB({dish: draftDish, basket})
        setBasketDishes([...basketDishes, newDish])
    }

    const removeDishFromBasket = async ({dish}) => {
        const toBeRemoved = basketDishes.find(d => d.id === dish.id)
        if (toBeRemoved) {
            await deleteDish_DB({dish: toBeRemoved})
            setBasketDishes(basketDishes.filter(d => d.id !== toBeRemoved.id))
            // setTotalPrice(currentTotalPrice=> (currentTotalPrice-(existingDish.price*existingDish.quantity)).toFixed(2) )
        }
    }


    return (<DishContext.Provider
            value={{
                addDishToBasket,

                dish,
                setDish,
                restaurantDishes,
                basketDishes,
                orderDishes,
            }}
        >
            {children}
        </DishContext.Provider>
    )
}

export default DishContextProvider;

export const useDishContext = () => useContext(DishContext);