import {DataStore} from "aws-amplify";
import {Basket, Dish, Order, Restaurant} from "../models";


//---async functions-----
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
const getDishes_ByOrder = async ({order}) => {
    const result = await DataStore.query(Dish, d =>
        d.and(d => [
            d.orderID.eq(order.id),
            d.basketID.eq(null)
        ]))
    // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ getDishes_ByOrder ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(result, null, 4))
    return result
}
const getRestaurant_ByOrder = async ({order}) => {
    const result = await DataStore.query(Restaurant, r =>
        r.and(r => [
            r.id.eq(order.restaurantID),
            r.isDeleted.eq(false)
        ]))
    // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ getRestaurant_ByOrder ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(result, null, 4))
    return result[0]
}
const getOrders_DB = async ({dbCustomer}) => {
    return await DataStore.query(Order, o => o.and(o => [
        o.customerID.eq(dbCustomer.id),
        o.isDeleted.eq(false)
    ]))
}
const getOrder_ByID = async ({id}) => {
    return await DataStore.query(Order, o => {
        o.and(o => [
                o.id.eq({id}),
                o.isDeleted.eq(false)
            ]
        )
    })
}


const createNewBasket_DB = async ({dbCustomer, restaurant}) => {
    return await DataStore.save(new Basket({
        customerID: dbCustomer?.id,
        restaurantID: restaurant?.id,
        isDeleted: false
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
        basketID: basket?.id,
        isActive: true,
        isDeleted: false,
        originalID: dish.id + "",
        orderID: null
    }
    return await DataStore.save(new Dish(newDish))
}
const createNewOrder_DB = async (draftOrder={}) => {
    if(Object.keys(draftOrder).length===0) return null
    const {totalPrice, restaurant, dbCustomer, dishes} = draftOrder

    //create the order
    return await DataStore.save(new Order({
        status: "NEW",
        total: parseFloat(totalPrice),
        restaurantLocation: restaurant.location,
        customerLocation: dbCustomer.location,
        isDeleted: false,
        customerID: dbCustomer.id,
        restaurantID: restaurant.id,
        dishes: dishes
    }))
}


const deleteDish_DB = async ({dish}) => {
    return await DataStore.save(
        Dish.copyOf(await dish, updated => {
            updated.isDeleted = true
        })
    )
}
const removeDish_basketID_DB = async ({dish}) => {
    return await DataStore.save(
        Dish.copyOf(await dish, updated => {
            updated.basketID = null
        })
    )
}
const removeDishesFromBasket_DB = async ({dishes}) => {
    const removed = dishes.map(async dish => await removeDish_basketID_DB({dish}))
    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ removed ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(removed, null, 4))
}


const updateDishQuantity_DB = async ({dish, quantity}) => {
    return await DataStore.save(Dish.copyOf(await dish, updated => {
        updated.quantity = quantity
    }))
}
const updateDish_DB = async ({dish, options = {}}) => {
    if (Object.keys(options).length === 0) return null
    return await DataStore.save(Dish.copyOf(await dish, updated => Object.assign(updated, options)))
}
const updateDishOrderID_DB = async ({dish, order}) => {
    return await DataStore.save(Dish.copyOf(
        dish, updated => {
            updated.orderID = order.id
        }))
}
const updateDishesAfterNewOrder_DB = async ({dishes, order}) => {
    //every dish that is related to this order ::

    // 1.dish.orderID = this order id
    // 2.dish.basketID = null
    const promises = []
    dishes.forEach( dish =>{
        promises.push(async ()=> await updateDish_DB({dish, options: {orderID: order.id, basketID : null}}))
    })
    return Promise.allSettled(promises)
}
//------------------


//---sync functions---
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
//-------------------


module.exports = {
    getOrder_ByID,
    getOrders_DB,
    updateDishOrderID_DB,
    createNewOrder_DB,
    updateDishesAfterNewOrder_DB,
    updateDish_DB,
    getBasket_DB,
    getDishes_ByBasket,
    getTotalPrice,
    getDish_ByID,
    createNewBasket_DB,
    updateDishQuantity_DB,
    createNewDish_DB,
    getDate,
    getTime,
    getDateAndTime,
    getDishes_ByOrder,
    getRestaurant_ByOrder,
    removeDishesFromBasket_DB,
    deleteDish_DB,
}