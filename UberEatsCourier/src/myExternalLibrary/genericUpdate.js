import {DataStore} from "aws-amplify";
import {Basket, Courier, Customer, Dish, Order, Owner, Restaurant} from "../models";

async function genericUpdate(model, id, toBeUpdated) {
    try {
        const original = await DataStore.query(model, id);
        await DataStore.save(model.copyOf(original,updated=>Object.assign(updated,toBeUpdated)));
        console.log(`Successfully updated ${model.name} with id ${id}`);
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
