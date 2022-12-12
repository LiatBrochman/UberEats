import {DataStore} from "aws-amplify";
import {Basket, Dish, Restaurant} from "../models";

const getBasketFromDB = async ({dbCustomer, restaurant}) => {
    const [res] = await DataStore.query(Basket, b =>
        b.and(b => [
            b.restaurantID.eq(restaurant?.id),
            b.CustomerID.eq(dbCustomer?.id)
        ]))
    return res
}
const getDishes_ByRestaurant = async ({restaurant})=>{
    return await DataStore.query(Dish, dish => dish.restaurantID.eq(restaurant.id))
}
const getDishes_ByCustomer= async ({dbCustomer}) => {
    return await DataStore.query(Dish, d => d.basketID.eq(dbCustomer?.id))
}
const getDishes_ByBasket= async ({basket}) => {
    return await DataStore.query(Dish, d => d.basketID.eq(basket?.id))
}
const getTotalPrice = async ({dishes, restaurant}) => {

    if (!dishes) return 0

    let totalPrice = restaurant.deliveryFee

    dishes.forEach(dish => totalPrice += dish.price)


}
const getDish = async id => {
    const res = await DataStore.query(Dish,id)
    return (res instanceof Array ? [res] : res)
}
const getRestaurant = async id => {
    const res = await DataStore.query(Restaurant,id)
    return (res instanceof Array ? [res] : res)
}