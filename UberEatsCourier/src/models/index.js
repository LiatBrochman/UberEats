// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const OrderStatus = {
  "NEW": "NEW",
  "COOKING": "COOKING",
  "READY_FOR_PICKUP": "READY_FOR_PICKUP",
  "PICKED_UP": "PICKED_UP",
  "COMPLETED": "COMPLETED",
  "ACCEPTED": "ACCEPTED"
};

const TransportationModes = {
  "DRIVING": "DRIVING",
  "BICYCLING": "BICYCLING"
};

const { Restaurant, Dish, Order, Basket, Customer, Courier, Location } = initSchema(schema);

export {
  Restaurant,
  Dish,
  Order,
  Basket,
  Customer,
  Courier,
  OrderStatus,
  TransportationModes,
  Location
};