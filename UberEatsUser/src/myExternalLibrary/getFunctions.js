import {DataStore} from "aws-amplify";
import {Dish, Restaurant} from "../models";


export async function getAllRestaurants() {
    return await DataStore.query(Restaurant)
}
export async function getAllDishes() {
    return await DataStore.query(Dish, d => d.and(d=> [d.originalID.eq("null"),d.isDeleted.eq(false)]))
}


