// import {createContext, useState, useEffect, useContext} from "react";
// import {DataStore} from "aws-amplify";
// import {Basket, BasketDish, Dish, Restaurant} from "../models";
// import {useAuthContext} from "./AuthContext";
//
// const BasketContext = createContext({});
//
// const BasketContextProvider = ({children}) => {
//     // const getBasketFromDB = async() => {
//     //     return await DataStore.query(Basket, b =>
//     //         b.and(b => [
//     //             b.restaurantID.eq(restaurant?.id),
//     //             b.userID.eq(dbUser?.id)
//     //         ]))
//     // }
//     // const getBasketDishesFromDB = async() => {
//     //     return await DataStore.query(BasketDish,bd => bd.basketID.eq(basket?.id))
//     // }
//     // const getRestaurantFromDB = async() => {
//     //     return await DataStore.query(Restaurant)
//     // }
//     const {dbUser} = useAuthContext();
//     const [restaurant, setRestaurant] = useState();
//     const [basket, setBasket] = useState();
//     const [basketDishes, setBasketDishes] = useState([]);
//
//     // const [totalPrice, setTotalPrice] = useState(0)
//     // const [dish, setDish] = useState(null)
//     const totalPrice = basketDishes.reduce(
//         (sum, basketDish) => {
//             // console.table([sum,basketDish.quantity,basketDish.Dish.price])
//             console.log("@@@@@@@@@@@@@",basketDish.Dish)
//             return sum + basketDish.quantity * basketDish.Dish.price
//         }
//         , restaurant?.deliveryFee
//     );
//
//     // useEffect(() => {
//     //     console.log(`\n\ndbUser:`, dbUser)
//     // }, [dbUser])
//     //
//     // useEffect(() => {
//     //     console.log(`\n\nrestaurant:`, restaurant)
//     // }, [restaurant])
//     //
//     // useEffect(() => {
//     //     console.log(`\n\nbasket:`, basket)
//     // }, [basket])
//     //
//     // useEffect(() => {
//     //     console.log(`\n\nbasketDishes:`, basketDishes)
//     // }, [basketDishes])
//     //
//     // useEffect(() => {
//     //     console.log(`\n\ntotalPrice:`, totalPrice)
//     // }, [totalPrice])
//
//     //====logs====/
//     // useEffect(() => {
//     //     console.log(`\n\nBasketContext. basketDishes:`, basketDishes)
//     // }, [basketDishes])
//     //----logs----/
//
//     // useEffect(() => {
//     //     setTotalPrice(basketDishes.reduce(
//     //         (sum, basketDish) => {
//     //             console.log('\n\n')
//     //             console.log('\ncalculating total price. sum:', sum)
//     //             console.log('\ndish', basketDish.Dish)
//     //             console.log('\nbasket dish :', basketDish.Dish)
//     //             console.log("\ndish:", dish)
//     //             return sum + basketDish?.quantity * basketDish?.Dish.price
//     //         }
//     //         , restaurant?.deliveryFee || 0))
//     // }, [basketDishes]);
//
//
//     useEffect(() => {
//         if(dbUser && restaurant) {
//             DataStore.query(Basket, basket =>
//                 basket.and(basket => [
//                     basket.restaurantID.eq(restaurant?.id),
//                     basket.userID.eq(dbUser?.id)
//                 ])
//             ).then(baskets => setBasket(baskets[0]))
//         }
//     }, [restaurant, dbUser]);
//
//     useEffect(() => {
//         if (basket) {
//             console.log("\n\n\n~~~~~~~~~~~~~found an existing basket!",basket)
//             DataStore.query(BasketDish, bd => bd.basketID.eq(basket.id))
//                 .then(bd=>{
//                     console.log("TEST BD",bd[0].Dish)
//                 if (bd[0].Dish['_z']) setBasketDishes(bd)
//             })
//
//         }
//     }, [basket]);
//
//
// ////////////my fix
// //     useEffect(() => {
// //         DataStore.query(Dish, d => d.id.eq(basketDish.basketDishDishId))
// //             .then(newDish => setDish(oldDish => [...oldDish, newDish]))
// //
// //     }, [basketDishes]);
// ///////////
//
//
//     const addDishToBasket = async (dish, quantity) => {
//         //get the existing basket or create a new one
//         let theBasket = basket || (await createNewBasket());
//
//         // create a BasketDish item and save to Datastore
//         const newBasketDish = await DataStore.save(new BasketDish({quantity, Dish: dish, basketID: theBasket.id})
//         );
//
//         // console.log("\n\nnew dish:",newDish)
//         setBasketDishes([...basketDishes, newBasketDish]);
//     };
//
//     const createNewBasket = async () => {
//         const newBasket = await DataStore.save(new Basket({userID: dbUser?.id, restaurantID: restaurant?.id}));
//         setBasket(newBasket);
//         return newBasket;
//     };
//
//     return (<BasketContext.Provider
//             value={{
//                 addDishToBasket,
//                 setRestaurant,
//                 restaurant,
//                 basket,
//                 basketDishes,
//                 totalPrice,
//             }}
//         >
//             {children}
//         </BasketContext.Provider>
//     );
// };
//
// export default BasketContextProvider;
//
// export const useBasketContext = () => useContext(BasketContext);
