import {DataStore} from "aws-amplify";
import {Dish, Restaurant} from "../models";
import {createContext, useState, useEffect, useContext} from "react";
import {getAllRestaurants} from "./Queries";

const RestaurantContext = createContext({})

const RestaurantContextProvider = ({children}) => {

    const [allRestaurants, setAllRestaurants] = useState()
    const [restaurant, setRestaurant] = useState()


    useEffect(()=>{
        getAllRestaurants().then(setAllRestaurants)
    },[])


    return (<RestaurantContext.Provider
            value={{
                allRestaurants,
                restaurant,
                setRestaurant,
            }}
        >
            {children}
        </RestaurantContext.Provider>
    );

}


export default RestaurantContextProvider;
export const useRestaurantContext = () => useContext(RestaurantContext);


