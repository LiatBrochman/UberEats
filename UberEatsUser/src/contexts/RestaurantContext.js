import {DataStore} from "aws-amplify";
import {Dish, Restaurant} from "../models";
import {createContext, useState, useEffect, useContext} from "react";

const getDishes_ByRestaurant = async ({restaurant})=>{
    return await DataStore.query(Dish, dish => dish.restaurantID.eq(restaurant.id))
}



const RestaurantContext = createContext({})
const RestaurantContextProvider = ({children}) => {
    const getRestaurant_ByID = async id => {
        // const res =
        return await DataStore.query(Restaurant,id)
        // return (res instanceof Array ? [res] : res)
    }

    const [restaurant, setRestaurant] = useState()
    const [dishes, setDishes] = useState()

    useEffect(() => {
        restaurant && !dishes && getDishes_ByRestaurant({restaurant}).then(setDishes)
    }, [restaurant])



    return (<RestaurantContext.Provider
            value={{
                getRestaurant_ByID,

                restaurant,
                setRestaurant,

                dishes,
                setDishes,

            }}
        >
            {children}
        </RestaurantContext.Provider>
    );

}



export default RestaurantContextProvider;
export const useRestaurantContext = () => useContext(RestaurantContext);


