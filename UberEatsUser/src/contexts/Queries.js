import {DataStore} from "aws-amplify";
import {Basket, Dish, Restaurant} from "../models";

const getBasket_DB = async ({dbCustomer, restaurant}) => {
    const [getBasket_DB] = await DataStore.query(Basket, b =>
        b.and(b => [
            b.restaurantID.eq(restaurant?.id),
            b.customerID.eq(dbCustomer?.id),
            b.isDeleted.eq(false)
        ]))
    //     .then(result =>{
    //     if(!result) return null
    //     if(result instanceof Array ) {
    //         return result.filter(entity=>entity.isDeleted===false)
    //     }else{
    //         return result
    //     }
    // })
    return getBasket_DB
}
const getDishes_ByBasket = async ({basket}) => {
    return await DataStore.query(Dish, d =>
        d.and(d => [
            d.basketID.eq(basket?.id),
            d.isDeleted.eq(false)
        ]))
}
const getTotalPrice = ({dishes, restaurant}) => {

    if (dishes && restaurant?.deliveryFee) {

        let totalPrice_calc = restaurant.deliveryFee

        dishes.forEach(dish => totalPrice_calc += dish.price * dish.quantity)

        return (typeof totalPrice_calc === "number") && totalPrice_calc.toFixed(2)
    }
    return 0
    // return dishes.reduce(
    //     async (sum, dish) => {
    //
    //         return await DataStore.query(Dish, d => d.id.eq(basketDish.basketDishDishId))
    //             .then(([dish])=>{
    //             console.log("dish price=", Number(dish.price))
    //             console.log("basketDish.quantity=", Number(basketDish.quantity))
    //             console.log("sum=", sum)
    //             if(sum.hasOwnProperty('_z')) sum=sum['_z']
    //             console.log(sum)
    //             // console.log("\n\n\n######## basket dish is:",basketDish)
    //             // // console.log("\n\n\n@@@@@@@@ DISH :",basketDish.Dish)
    //             // console.log("\n\n\n@@@@@@@@ DISH query :", await DataStore.query(Dish, d=> d.id.eq(basketDish.basketDishDishId)))
    //             const res = sum + basketDish.quantity * dish.price
    //             console.log("calc",res)
    //             return res
    //         })
    //     }
    //     , restaurant?.deliveryFee)
}
const getDish_ByID = async ({id}) => {

    const result = await DataStore.query(Dish, d =>
        d.and(d => [
            d.id.eq(id),
            d.isDeleted.eq(false)
        ]))
    return (
        result instanceof Array
            ? result[0]
            : result
    )
}
const createNewBasket_DB = async ({dbCustomer, restaurant}) => {
    return await DataStore.save(new Basket({
        customerID: dbCustomer?.id,
        restaurantID: restaurant?.id,
        isDeleted: false
    }))
}
const updateDishQuantity_DB = async ({dish, quantity}) => {
    return await DataStore.save(Dish.copyOf(await dish, updated => {
        updated.quantity = quantity
    }))
}
const createNewDish_DB = async ({dish, basket}) => {
    const newDish = {
        name: dish.name,
        price: dish.price,
        image: dish.image,
        description: dish.description,
        quantity: dish.quantity,
        restaurantID: dish.restaurantID,
        basketID: basket.id,
        isActive: true,
        isDeleted: false,
        originalID: dish.id + ""
    }
    return await DataStore.save(new Dish(newDish))
}
const removeDish_DB = async ({dish}) => {
    return await DataStore.save(
        Dish.copyOf(await dish, updated => {
            updated.isDeleted = true
        })
    )
}
const getDate = ({order}) => {
    if (order && order?.createdAt) {
        let date = new Date(order.createdAt)
        return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()
    }
}
const getTime = ({order}) => {
    if (order && order?.createdAt) {
        let date = new Date(order.createdAt)
        return date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
    }
}
const getDateAndTime = ({order}) => {
    if (order && order?.createdAt) {
        let date = new Date(order.createdAt)
        return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '  ' + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
    }
}
const getOrderQuantity = async ({order}) => {
    const dishesOfOrder = await DataStore.query(Dish, d => d.and(d => [
        d.orderID.eq(order.id),
        d.isDeleted.eq(false)
    ]))
    if(dishesOfOrder?._z){
        console.error("\n\n ~~~~~~~~~~~~~~~~~~~~~ dishesOfOrder ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(dishesOfOrder,null,4))
        return null
    }
    if(dishesOfOrder){
        return dishesOfOrder.reduce((count,dish)=>count+dish.quantity,0)
    }else{
       console.error("\n\n ~~~~~~~~~~~~~~~~~~~~~ dishesOfOrder ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(dishesOfOrder,null,4))
        return null
    }

}
const getRestaurant_byOrder = async ({order})=>{
    const restaurant = await DataStore.query(Restaurant,r=>r.and(r=>[
        r.id.eq(order.restaurantID),
    ]))
    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ restaurant[0] ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(restaurant?.[0],null,4))

    return restaurant[0]
}



module.exports = {
    getRestaurant_byOrder,
    getOrderQuantity,
    getBasket_DB,
    getDishes_ByBasket,
    getTotalPrice,
    getDish_ByID,
    createNewBasket_DB,
    updateDishQuantity_DB,
    createNewDish_DB,
    removeDish_DB,
    getDate,
    getTime,
    getDateAndTime,
}

