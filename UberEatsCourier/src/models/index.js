// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const OrderStatus = {
  "NEW": "NEW",
  "COOKING": "COOKING",
  "READY_FOR_PICKUP": "READY_FOR_PICKUP",
  "PICKED_UP": "PICKED_UP",
  "COMPLETED": "COMPLETED",
  "ACCEPTED": "ACCEPTED",
  "DECLINED": "DECLINED"
};

const TransportationModes = {
  "DRIVING": "DRIVING",
  "BICYCLING": "BICYCLING"
};

const { Owner, Restaurant, Dish, Customer, Order, Basket, Courier, Location } = initSchema(schema);

export {
  Owner,
  Restaurant,
  Dish,
  Customer,
  Order,
  Basket,
  Courier,
  OrderStatus,
  TransportationModes,
  Location
};