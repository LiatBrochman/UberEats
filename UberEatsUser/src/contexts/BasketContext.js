import {createContext, useState, useEffect, useContext} from "react";
import {DataStore} from "aws-amplify";
import {Basket, BasketDish, Restaurant} from "../models";
import {useAuthContext} from "./AuthContext";
import {useRoute} from "@react-navigation/native";

const BasketContext = createContext({});

const BasketContextProvider = ({children}) => {

    const getRestaurantFromDB = async() => {
        console.log("\n\n\n1.getRestaurantFromDB")
        const id = route.params?.id
        console.log("\n\n\n~~~~~~~~~~~~my res id",id)
        return await DataStore.query(Restaurant, id)
    }
    const getBasketFromDB = async({dbUser,restaurant}) => {
        console.log("\n\n\n2.getBasketFromDB")
        const res= await DataStore.query(Basket, b =>
            b.and(b => [
                b.restaurantID.eq(restaurant?.id),
                b.userID.eq(dbUser?.id)
            ]))
        console.log("\n\n\nbasket RES=",res)
        return res[0]
    }
    const getBasketDishesFromDB = async({basket}) => {
        console.log("\n\n\n3.getBasketDishesFromDB")
        const res=  await DataStore.query(BasketDish,bd => bd.basketID.eq(basket.id))
        console.log("\n\n\nbasketDishes RES=",res)
        return res
    }
    const getTotalPrice = async ({basketDishes,restaurant})=>{
        console.log("\n\n\n4.getTotalPrice")
        basketDishes.reduce(
            (sum, basketDish) => {
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

    // useEffect(()=>{
    //     setRestaurant((async()=> await getRestaurantFromDB())())
    // },[]);
    useEffect(() => {

        if(restaurant && !basket) {


            (async () => {

                const data = await getBasketFromDB({dbUser, restaurant})
                console.log("\n\n\n~~~~~~~~~~~~~~~basket=", data)
                if (data) {

                    console.log("\n\n\nSetting Basket to::",data)
                    setBasket(data)
                }

            })()
        }
        // restaurant && !basket && console.log("\n\n\n~~~~~~~~~~~~~~~restaurant=",restaurant)
        // restaurant && !basket && setBasket((async ()=> {
        //     const result = await getBasketFromDB(dbUser,restaurant)
        //     if(result['z']) return result
        // })())
    }, [restaurant]);

    useEffect(() => {

        if(basket && !basketDishes){

            (async ()=>{
                const data = await getBasketDishesFromDB({basket})
                console.log("\n\n\n~~~~~~~~~~~~~~~basket dish=",data)

                if(data){
                    console.log("Setting BasketDish to::",data)
                    setBasketDishes(data)
                }
            })()

        }

        // basket && !basketDishes && console.log("\n\n\n~~~~~~~~~~~~~~~basket=",basket)
        // basket && !basketDishes && setBasketDishes((async ()=> {
        //      const result = await getBasketDishesFromDB(basket)
        //     if(result['z']) return result
        // }))
    }, [basket]);

    useEffect(() => {

        const data = (async ()=> await getTotalPrice({basketDishes,restaurant}))()
        // console.log("\n\n\n~~~~~~~~~~~~~~~basketDishes=",basketDishes)
        if(data){
            console.log("Setting Total Price to::",data)
            setTotalPrice(data)
        }
        // basketDishes && restaurant && setTotalPrice((async ()=> {
        //      const result = await getTotalPrice(basketDishes,restaurant)
        //     if(result) return result
        // }))
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