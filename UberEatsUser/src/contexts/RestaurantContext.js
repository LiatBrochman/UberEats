import {DataStore} from "aws-amplify";
import {Dish, Restaurant} from "../models";
import {createContext, useState, useEffect, useContext} from "react";
import {getAllRestaurants} from "./Queries";

const getDishes_ByRestaurant = async ({restaurant}) => {
    const restaurantDishes = await DataStore.query(Dish, dish => dish.and(
        dish =>
            [
                //dish.basketID.eq('null'),
                //dish.originalID.eq(''),
                //dish.orderID.eq('null'),
                dish.restaurantID.eq(restaurant.id),
                dish.isDeleted.eq(false)
            ]
    ))
        // .then(ds=>
        //     ds && ds instanceof Array && ds[0] instanceof Dish
        //         ? ds.filter(d=> !!d?.originalID)
        //         : undefined
        // )

    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ getDishes_ByRestaurant() ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(restaurantDishes, null, 4))

    return restaurantDishes
}


const RestaurantContext = createContext({})
const RestaurantContextProvider = ({children}) => {

    const getRestaurant_ByID = async ({id}) => {
        // const res =
        return await DataStore.query(Restaurant, rest=>
        rest.and(rest=>[
           rest.id.eq(id),
            rest.isDeleted.eq(false)
        ])
        )

        // return (res instanceof Array ? [res] : res)
    }
    const [allRestaurants, setAllRestaurants] = useState()
    const [restaurant, setRestaurant] = useState()
    const [dishes, setDishes] = useState()

    useEffect(()=>{
        getAllRestaurants().then(setAllRestaurants)
    },[]);

    useEffect(() => {
        restaurant && !dishes && getDishes_ByRestaurant({restaurant}).then(setDishes)
    }, [restaurant])


    return (<RestaurantContext.Provider
            value={{
                getRestaurant_ByID,
                allRestaurants,
                restaurant,
                setRestaurant,

                dishes,

            }}
        >
            {children}
        </RestaurantContext.Provider>
    );

}


export default RestaurantContextProvider;
export const useRestaurantContext = () => useContext(RestaurantContext);


