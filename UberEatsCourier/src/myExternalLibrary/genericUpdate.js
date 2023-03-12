import {DataStore} from "aws-amplify";
import {Basket, Courier, Customer, Dish, Order, Owner, Restaurant} from "../models";

async function genericUpdate(model, id, toBeUpdated) {
    try {
        const original = await DataStore.query(model, id);
        return await DataStore.save(model.copyOf(original, updated => {

            return Object.assign(updated, toBeUpdated)

            // if (updated?.timeToArrive && updated.timeToArrive.length > 2) {
            //
            //     console.log("!!!!!!!!!!!!!!!!!!!updated.timeToArrive.length is more than 2 :", updated.timeToArrive)
            //     updated.timeToArrive = []
            //     toBeUpdated.timeToArrive?.[0] && updated.timeToArrive.push(toBeUpdated.timeToArrive[0])
            //     toBeUpdated.timeToArrive?.[1] && updated.timeToArrive.push(toBeUpdated.timeToArrive[1])
            //
            // }
            // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ updated ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(updated.timeToArrive, null, 4))
            // return updated
        }));
        // console.log(`Successfully updated ${model.name} with id ${id}`);
    } catch (error) {
        console.error(`Error updating ${model.name} with id ${id}: ${error.message}`);
    }
}

export async function updateCourier(id, data) {
    if(data?.timeToArrive){

        while(data.timeToArrive.length > 2) {
            data.timeToArrive.shift()
        }

    }
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
