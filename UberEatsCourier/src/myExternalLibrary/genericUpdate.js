import {DataStore} from "aws-amplify";
import {Basket, Courier, Customer, Dish, Order, Owner, Restaurant} from "../models";

// async function genericUpdate(model, id, toBeUpdated) {
//     try {
//         const original = await DataStore.query(model, id);
//         return await DataStore.save(model.copyOf(original, updated => {
//
//             // if (toBeUpdated?.timeToArrive) {
//             //     console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ before updated ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(updated, null, 4))
//             //
//             //
//             //     updated.timeToArrive = []
//             //
//             //     toBeUpdated.timeToArrive.forEach(time => {
//             //         updated.timeToArrive.push(time)
//             //     })
//             //
//             //     console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ after updated ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(updated, null, 4))
//             //     return updated
//             //
//             // }
//             //
//             // return Object.assign(updated, toBeUpdated)
//
//             for (const [key, value] of Object.entries(toBeUpdated)) {
//                 updated[key] = value
//             }
//
//             return updated
//         }));
//         // console.log(`Successfully updated ${model.name} with id ${id}`);
//     } catch (error) {
//         console.error(`Error updating ${model.name} with id ${id}: ${error.message}`);
//     }
// }
async function genericUpdate(model, id, toBeUpdated) {
    try {
        const original = await DataStore.query(model, id)

        return await DataStore.save(model.copyOf(original, updated => {

        //     for (const [key, value] of Object.entries(toBeUpdated)) {
        //         console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ value ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(value, null, 4))
        //
        //         updated[key] = value
        //     }
        //     return updated
        // }))
            Object.assign(updated, toBeUpdated)}
        ))

        //     if (Array.isArray(value) && original[key].length > value.length) {
        //
        //         updated[key] = value
        //         updated[key].push(0)
        //
        //
        //     } else {
        //         updated[key] = value
        //     }
        // }

        // return updated
        // }))

    } catch (error) {
        console.error(`Error updating ${model.name} with id ${id}: ${error.message}`);
    }
}


export async function updateCourier(id, data) {
    await genericUpdate(Courier, id, data);
}

export async function updateOrder(id, data) {
    await genericUpdate(Order, id, data);
}

export async function updateRestaurant(id, data) {
    await genericUpdate(Restaurant, id, data);
}

export async function updateDish(id, data) {
    await genericUpdate(Dish, id, data);
}

export async function updateOwner(id, data) {
    await genericUpdate(Owner, id, data);
}

export async function updateBasket(id, data) {
    await genericUpdate(Basket, id, data);
}

export async function updateCustomer(id, data) {
    await genericUpdate(Customer, id, data);
}
