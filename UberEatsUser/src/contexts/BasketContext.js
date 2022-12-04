import {createContext, useState, useEffect, useContext} from "react";
import {DataStore} from "aws-amplify";
import {Basket, BasketDish} from "../models";
import {useAuthContext} from "./AuthContext";

const BasketContext = createContext({});

const BasketContextProvider = ({children}) => {
    const {dbUser} = useAuthContext();

    const [restaurant, setRestaurant] = useState(null);
    const [basket, setBasket] = useState(null);
    const [basketDishes, setBasketDishes] = useState([]);
    // const [totalPrice, setTotalPrice] = useState(0)

    const totalPrice = basketDishes.reduce(
        (sum, basketDish) => sum + basketDish.quantity * basketDish.Dish.price,
        restaurant?.deliveryFee
    );

    // useEffect(() => {
    //     console.log(`\n\ndbUser:`, dbUser)
    // }, [dbUser])
    //
    // useEffect(() => {
    //     console.log(`\n\nrestaurant:`, restaurant)
    // }, [restaurant])
    //
    // useEffect(() => {
    //     console.log(`\n\nbasket:`, basket)
    // }, [basket])
    //
    // useEffect(() => {
    //     console.log(`\n\nbasketDishes:`, basketDishes)
    // }, [basketDishes])
    //
    // useEffect(() => {
    //     console.log(`\n\ntotalPrice:`, totalPrice)
    // }, [totalPrice])



    useEffect(() => {
        // console.log("\n\ntotal price before:",totalPrice)
        setTotalPrice(basketDishes.reduce(
            (sum, basketDishes) => {
                // console.log("\n\ncalculating total price")
                // console.log('sum:', sum, '\ndish :',  basketDishes?.Dish)
                return sum + basketDishes?.quantity * basketDishes?.Dish.price
            }
            , restaurant?.deliveryFee || 0))
            // console.log("\n\ntotalPrice after:",totalPrice)
    }, [basketDishes]);


    useEffect(() => {
        // console.log("\n\nbasket before:",basket)
        DataStore.query(Basket, (b) =>
            // b.and(b => [
                b.restaurantID.eq(restaurant.id).userID.eq(dbUser.id)
        ).then((baskets) => setBasket(baskets[0]));
            // console.log("\n\nbasket:",baskets[0])
            // console.log("\n\nbasket dish:",baskets[0]?.basketDish)
            // .then(()=>console.log("\n\nbasket after:",basket))

    }, [dbUser, restaurant]);

    useEffect(() => {
        // basket && console.log("\n\nbasketDish before:",basketDishes)
        if (basket) {
            DataStore.query(BasketDish, (bd) => bd.basketID.eq(basket.id)).then(
                setBasketDishes
            );
        }
                // .then(r=>console.log("\n\nres=",r))
            // .then(()=>console.log("\n\nbasketDish after:",basketDishes))


    }, [basket]);


    const addDishToBasket = async (dish, quantity) => {
        //get the existing basket or create a new one
        let theBasket = basket || (await createNewBasket());

        // create a BasketDish item and save to Datastore
        const newDish = await DataStore.save(new BasketDish({quantity, Dish: dish, basketID: theBasket.id})
        );

        // console.log("\n\nnew dish:",newDish)
        setBasketDishes([...basketDishes, newDish]);
    };

    const createNewBasket = async () => {
        const newBasket = await DataStore.save(
            new Basket({userID: dbUser.id, restaurantID: restaurant.id})
        );
        // console.log("\n\nnew basket:",newBasket)

        setBasket(newBasket);
        return newBasket;
    };

    return (<BasketContext.Provider
        value={{
        addDishToBasket,
        setRestaurant,
        restaurant,
        basket,
        basketDishes,
        totalPrice,
    }}
    >
        {children}
    </BasketContext.Provider>
    );
};

export default BasketContextProvider;

export const useBasketContext = () => useContext(BasketContext);
