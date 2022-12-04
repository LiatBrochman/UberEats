import {createContext, useState, useEffect, useContext} from "react";
import {DataStore} from 'aws-amplify';
import {Basket, BasketDish} from '../models';
import {useAuthContext} from "./AuthContext";

const BasketContext = createContext({});

const BasketContextProvider = ({children}) => {
    const {dbUser} = useAuthContext();

    const [restaurant, setRestaurant] = useState(null);
    const [basket, setBasket] = useState(null);
    const [basketDishes, setBasketDishes] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)

    //====logs====/
    useEffect(() => {
        console.log(`\n\nBasketContext. dbUser: 1,9,13$`, dbUser)
    }, [dbUser])

    useEffect(() => {
        console.log(`\n\nBasketContext. restaurant: 2,wait for click,15$`, restaurant)
    }, [restaurant])

    useEffect(() => {
        console.log(`\n\nBasketContext. basket: 3,wait for click,16$`, basket)
    }, [basket])

    useEffect(() => {
        console.log(`\n\nBasketContext. basketDishes: 4,wait for click,17$`, basketDishes)
    }, [basketDishes])

    useEffect(() => {
        console.log(`\n\nBasketContext. totalPrice: 5,wait for click,18 value=`, totalPrice)
    }, [totalPrice])
    //----logs----/


    useEffect(() => {
        setTotalPrice(basketDishes.reduce(
            (sum, basketDishes) => sum + basketDishes?.quantity * basketDishes?.Dish.price
            , restaurant?.deliveryFee || 0))
    }, [basketDishes]);

    useEffect(() => {
        DataStore.query(Basket, basket =>
            basket.and(basket => [
                basket.restaurantID.eq(restaurant?.id),
                basket.userID.eq(dbUser?.id)
            ])
        ).then(baskets => setBasket(baskets[0]))

    }, [dbUser, restaurant])

    useEffect(() => {
        (!!(basket?.id)) && DataStore.query(BasketDish, bd => bd.basketID.eq(basket.id)).then(setBasketDishes)
    }, [basket]);


    const addDishToBasket = async (dish, quantity) => {
        let theBasket = basket || (await createNewBasket());
        const newDish = await DataStore.save(new BasketDish({quantity, Dish: dish, basketID: theBasket.id}));
        setBasketDishes([...basketDishes, newDish])
    };

    const createNewBasket = async () => {
        const newBasket = await DataStore.save(new Basket({userID: dbUser?.id, restaurantID: restaurant?.id}));
        setBasket(newBasket);
        return newBasket;
    };

    return (<BasketContext.Provider value={{
        addDishToBasket,
        setRestaurant,
        restaurant,
        basket,
        basketDishes,
        totalPrice
    }}>{children}</BasketContext.Provider>)
};

export default BasketContextProvider;

export const useBasketContext = () => useContext(BasketContext)
