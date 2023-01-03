import {DataStore} from "aws-amplify";
import {Basket, Dish, Order, Restaurant} from "../models";


//---async functions-----
const getRestaurantDishes = async ({restaurant}) => {
    const res = await DataStore.query(Dish, d =>
        d.and(d => [
            d.restaurantID.eq(restaurant.id),
            d.originalID.eq('null'),
            d.isDeleted.eq(false)
        ])
    )
    // console.warn("\n\n ~~~~~~~~~~~~~~~~~~~~~ getRestaurantDishes ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(res, null, 4))

    // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ getRestaurantDishes ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(res, null, 4))
    return res
}
const getBasketDishes = async ({basket}) => {
    const res = await DataStore.query(Dish, d =>
        d.and(d => [
            d.basketID.eq(basket.id),
            d.isDeleted.eq(false),
        ])
    )
    //console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ res of getBasketDishes ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(res, null, 4))

    return res
}
const getOrderDishes = async ({order}) => {
    return await DataStore.query(Dish, d =>
        d.and(d => [
            d.orderID.eq(order.id),
            d.isDeleted.eq(false)
        ])
    )
}
const getTotalPrice = async ({basket, restaurant = {}}) => {
    if (!basket) {
        return null
    }

    if (!(restaurant?.deliveryFee)) {
        restaurant = await getRestaurant_ByID({id: basket?.restaurantID})
    }

    const totalPrice = getBasketDishes({basket}).then(basketDishes =>
        basketDishes.reduce((count, dish) => count + (dish.quantity * dish.price), restaurant.deliveryFee))

    if ((typeof totalPrice === 'number') && (totalPrice > restaurant?.deliveryFee)) {
        return Number(totalPrice.toFixed(2))
    } else {
        return Number(restaurant.deliveryFee.toFixed(2))
    }
}
const getRestaurant_ByID = async ({id}) => {
    const res = await DataStore.query(Restaurant, rest =>
        rest.and(rest => [
            rest.id.eq(id),
            rest.isDeleted.eq(false)
        ])
    )
    return (res instanceof Array ? res[0] : res)
}
const getDishQuantity = async ({basket, dish_of_restaurant}) => {

    if (!basket || !dish_of_restaurant) {
        console.error("basket and dish_of_restaurant", basket, "\n", dish_of_restaurant)
    }

    const result = await DataStore.query(Dish, dish =>
        dish.and(dish =>
            [
                dish.originalID.eq(dish_of_restaurant.id),
                dish.basketID.eq(basket.id),
                dish.isDeleted.eq(false)
            ]
        ))
    if (result?.[0]) {
        return result[0].quantity
    }
}

const getBasket_DB = async ({dbCustomer, restaurant}) => {
    if (!dbCustomer && !restaurant) return null
    const [getBasket_DB] = await DataStore.query(Basket, b =>
        b.and(b => [
            b.restaurantID.eq(restaurant?.id),
            b.customerID.eq(dbCustomer?.id),
            b.isDeleted.eq(false)
        ])
    )
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
        ])
    )
}
const getDish_ByID = async ({id}) => {

    const result = await DataStore.query(Dish, d =>
        d.and(d => [
            d.id.eq(id),
            d.isDeleted.eq(false)
        ])
    )
    if (result && result instanceof Array && result[0] instanceof Dish)
        return result[0]

}
const getDishes_ByOrder = async ({order}) => {
    const result = await DataStore.query(Dish, d =>
        d.and(d => [
            d.orderID.eq(order.id),
            d.basketID.eq(null)
        ])
    )
    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ getDishes_ByOrder ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(result, null, 4))
    return result
}
const getRestaurant_ByOrder = async ({order}) => {
    const result = await DataStore.query(Restaurant, r =>
        r.and(r => [
            r.id.eq(order.restaurantID),
            r.isDeleted.eq(false)
        ])
    )
    // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ getRestaurant_ByOrder ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(result, null, 4))
    return result[0]
}
const getOrders_DB = async ({dbCustomer}) => {
    return await DataStore.query(Order, o =>
        o.and(o => [
            o.customerID.eq(dbCustomer?.id),
            o.isDeleted.eq(false)
        ])
    )
}
const getOrder_ByID = async ({id}) => {
    return await DataStore.query(Order, o =>
        o.and(o => [
                o.id.eq({id}),
                o.isDeleted.eq(false)
            ]
        )
    )
}
const getAllRestaurants = async () => {
    return await DataStore.query(Restaurant, restaurant => restaurant.isDeleted.eq(false))
}
// const getDishes_ByRestaurant = async ({restaurant}) => {
//     const restaurantDishes = await DataStore.query(Dish, dish => {
//         dish.and(dish =>
//             [
//                 //dish.basketID.eq('null'),
//                 //dish.originalID.eq(''),
//                 //dish.orderID.eq('null'),
//                 dish.restaurantID.eq(restaurant.id),
//                 dish.isDeleted.eq(false)
//             ]
//     )})
//     // .then(ds=>
//     //     ds && ds instanceof Array && ds[0] instanceof Dish
//     //         ? ds.filter(d=> !!d?.originalID)
//     //         : undefined
//     // )
//
//     console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ getDishes_ByRestaurant() ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(restaurantDishes, null, 4))
//
//     return restaurantDishes
// }


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
        originalID: dish?.id + "",
        orderID: null
    }
    return await DataStore.save(new Dish(newDish))
}
const createNewOrder_DB = async (draftOrder = {}) => {
    if (Object.keys(draftOrder).length === 0) return null
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
    const origin = await getDish_ByID({id: dish.id})
    const res = await DataStore.save(Dish.copyOf(await origin, updated => {
        updated.quantity = quantity
    }))
    console.log("\n\n ~ updateDishQuantity_DB ~ :", JSON.stringify(res, null, 4))
    return res
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
    dishes.forEach(dish => {
        promises.push(async () => await updateDish_DB({dish, options: {orderID: order.id, basketID: null}}))
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
const getTotalPrice_OLD = ({dishes, restaurant}) => {

    if (dishes && restaurant?.deliveryFee) {

        let totalPrice_calc = restaurant?.deliveryFee

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
    getBasketDishes,
    getOrderDishes,
    getRestaurantDishes,
    // getDishes_ByRestaurant,
    getRestaurant_ByID,
    getAllRestaurants,
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
    getDishQuantity
}