import {createContext, useState, useEffect, useContext} from "react";
import {DataStore} from "aws-amplify";
import {Basket, BasketDish} from "../models";
import {useAuthContext} from "./AuthContext";

const BasketContext = createContext({});

const BasketContextProvider = ({children}) => {

    const getBasketFromDB = async({dbUser,restaurant}) => {
        const res= await DataStore.query(Basket, b =>
            b.and(b => [
                b.restaurantID.eq(restaurant?.id),
                b.userID.eq(dbUser?.id)
            ]))
        return res[0]
    }
    const getBasketDishesFromDB = async({basket}) => {
        const res=  await DataStore.query(BasketDish,bd => bd.basketID.eq(basket.id))
        return res
    }
    const getTotalPrice = async ({basketDishes,restaurant})=>{
        console.log("\n\n\n4.getTotalPrice")
        basketDishes.reduce(
            (sum, basketDish) => {
                console.log("\n\n\n######## basket dish is:",basketDish)
                console.log("\n\n\n@@@@@@@@ DISH :",basketDish.Dish)
                return sum + basketDish.quantity * basketDish.Dish['_z'].price
            }
            , restaurant?.deliveryFee)
    }

    const {dbUser} = useAuthContext();
    const [restaurant, setRestaurant] = useState();
    const [basket, setBasket] = useState();
    const [basketDishes, setBasketDishes] = useState();
    const [totalPrice, setTotalPrice] = useState();

    const clearBasketContext=()=>{
        setRestaurant(null)
        setBasket(null)
        setBasketDishes(null)
        setTotalPrice(0)
    }

    // useEffect(()=>{
    //     setRestaurant((async()=> await getRestaurantFromDB())())
    // },[]);
    useEffect(() => {

        if(restaurant && !basket) {
            (async () => {
                const data = await getBasketFromDB({dbUser, restaurant})
                if (data) {
                    setBasket(data)
                }
            })()
        }
    }, [restaurant]);

    useEffect(() => {

        if(basket && !basketDishes){
            (async ()=>{
                const data = await getBasketDishesFromDB({basket})
                if(data){
                    setBasketDishes(data)
                }
            })()

        }

    }, [basket]);

    useEffect(() => {

        if(basketDishes){
            const data = (async ()=> await getTotalPrice({basketDishes,restaurant}))()
            if(data){
                setTotalPrice(data)
            }
        }

    },[basketDishes]);


    const addDishToBasket = async (dish, quantity) => {
        //get the existing basket or create a new one
        let theBasket = basket || (await createNewBasket());

        // create a BasketDish item and save to Datastore
        const newBasketDish = await DataStore.save(new BasketDish({quantity, Dish: dish, basketID: theBasket.id})
        );

        // console.log("\n\nnew dish:",newDish)
        setBasketDishes([...basketDishes, newBasketDish]);
    };

    const createNewBasket = async () => {
        const newBasket = await DataStore.save(new Basket({userID: dbUser?.id, restaurantID: restaurant?.id}));
        setBasket(newBasket);
        return newBasket;
    };

    return (<BasketContext.Provider
            value={{
                addDishToBasket,
                clearBasketContext,

                restaurant,
                setRestaurant,

                basket,
                setBasket,

                basketDishes,
                setBasketDishes,

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