import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from "@aws-amplify/datastore";

export enum TransportaionModes {
  DRIVING = "DRIVING",
  BICYCLING = "BICYCLING"
}

export enum OrderStatus {
  NEW = "NEW",
  COOKING = "COOKING",
  READY_FOR_PICKUP = "READY_FOR_PICKUP",
  PICKED_UP = "PICKED_UP",
  COMPLETED = "COMPLETED"
}

type CourierMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type BasketMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type BasketDishMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type DishMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type OrderDishMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type OrderMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type RestaurantMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EagerCourier = {
  readonly id: string;
  readonly name: string;
  readonly sub: string;
  readonly lat?: string | null;
  readonly lng?: string | null;
  readonly transportionMode: TransportaionModes | keyof typeof TransportaionModes;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCourier = {
  readonly id: string;
  readonly name: string;
  readonly sub: string;
  readonly lat?: string | null;
  readonly lng?: string | null;
  readonly transportionMode: TransportaionModes | keyof typeof TransportaionModes;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Courier = LazyLoading extends LazyLoadingDisabled ? EagerCourier : LazyCourier

export declare const Courier: (new (init: ModelInit<Courier, CourierMetaData>) => Courier) & {
  copyOf(source: Courier, mutator: (draft: MutableModel<Courier, CourierMetaData>) => MutableModel<Courier, CourierMetaData> | void): Courier;
}

type EagerBasket = {
  readonly id: string;
  readonly BasketDishes?: (BasketDish | null)[] | null;
  readonly userID: string;
  readonly restaurantID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyBasket = {
  readonly id: string;
  readonly BasketDishes: AsyncCollection<BasketDish>;
  readonly userID: string;
  readonly restaurantID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Basket = LazyLoading extends LazyLoadingDisabled ? EagerBasket : LazyBasket

export declare const Basket: (new (init: ModelInit<Basket, BasketMetaData>) => Basket) & {
  copyOf(source: Basket, mutator: (draft: MutableModel<Basket, BasketMetaData>) => MutableModel<Basket, BasketMetaData> | void): Basket;
}

type EagerBasketDish = {
  readonly id: string;
  readonly quantity: number;
  readonly Dish?: Dish | null;
  readonly basketID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly basketDishDishId?: string | null;
}

type LazyBasketDish = {
  readonly id: string;
  readonly quantity: number;
  readonly Dish: AsyncItem<Dish | undefined>;
  readonly basketID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly basketDishDishId?: string | null;
}

export declare type BasketDish = LazyLoading extends LazyLoadingDisabled ? EagerBasketDish : LazyBasketDish

export declare const BasketDish: (new (init: ModelInit<BasketDish, BasketDishMetaData>) => BasketDish) & {
  copyOf(source: BasketDish, mutator: (draft: MutableModel<BasketDish, BasketDishMetaData>) => MutableModel<BasketDish, BasketDishMetaData> | void): BasketDish;
}

type EagerDish = {
  readonly id: string;
  readonly name: string;
  readonly image: string;
  readonly description?: string | null;
  readonly price: number;
  readonly restaurantID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyDish = {
  readonly id: string;
  readonly name: string;
  readonly image: string;
  readonly description?: string | null;
  readonly price: number;
  readonly restaurantID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Dish = LazyLoading extends LazyLoadingDisabled ? EagerDish : LazyDish

export declare const Dish: (new (init: ModelInit<Dish, DishMetaData>) => Dish) & {
  copyOf(source: Dish, mutator: (draft: MutableModel<Dish, DishMetaData>) => MutableModel<Dish, DishMetaData> | void): Dish;
}

type EagerOrderDish = {
  readonly id: string;
  readonly quantity: number;
  readonly Dish?: Dish | null;
  readonly orderID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly orderDishDishId?: string | null;
}

type LazyOrderDish = {
  readonly id: string;
  readonly quantity: number;
  readonly Dish: AsyncItem<Dish | undefined>;
  readonly orderID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly orderDishDishId?: string | null;
}

export declare type OrderDish = LazyLoading extends LazyLoadingDisabled ? EagerOrderDish : LazyOrderDish

export declare const OrderDish: (new (init: ModelInit<OrderDish, OrderDishMetaData>) => OrderDish) & {
  copyOf(source: OrderDish, mutator: (draft: MutableModel<OrderDish, OrderDishMetaData>) => MutableModel<OrderDish, OrderDishMetaData> | void): OrderDish;
}

type EagerOrder = {
  readonly id: string;
  readonly userID: string;
  readonly Restaurant?: Restaurant | null;
  readonly total: number;
  readonly status: OrderStatus | keyof typeof OrderStatus;
  readonly OrderDishes?: (OrderDish | null)[] | null;
  readonly Courier?: Courier | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly orderRestaurantId?: string | null;
  readonly orderCourierId?: string | null;
}

type LazyOrder = {
  readonly id: string;
  readonly userID: string;
  readonly Restaurant: AsyncItem<Restaurant | undefined>;
  readonly total: number;
  readonly status: OrderStatus | keyof typeof OrderStatus;
  readonly OrderDishes: AsyncCollection<OrderDish>;
  readonly Courier: AsyncItem<Courier | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly orderRestaurantId?: string | null;
  readonly orderCourierId?: string | null;
}

export declare type Order = LazyLoading extends LazyLoadingDisabled ? EagerOrder : LazyOrder

export declare const Order: (new (init: ModelInit<Order, OrderMetaData>) => Order) & {
  copyOf(source: Order, mutator: (draft: MutableModel<Order, OrderMetaData>) => MutableModel<Order, OrderMetaData> | void): Order;
}

type EagerRestaurant = {
  readonly id: string;
  readonly name: string;
  readonly image: string;
  readonly deliveryFee: number;
  readonly minDeliveryTime: number;
  readonly maxDeliveryTime: number;
  readonly rating?: number | null;
  readonly address: string;
  readonly lat: number;
  readonly lng: number;
  readonly Dishes?: (Dish | null)[] | null;
  readonly Baskets?: (Basket | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyRestaurant = {
  readonly id: string;
  readonly name: string;
  readonly image: string;
  readonly deliveryFee: number;
  readonly minDeliveryTime: number;
  readonly maxDeliveryTime: number;
  readonly rating?: number | null;
  readonly address: string;
  readonly lat: number;
  readonly lng: number;
  readonly Dishes: AsyncCollection<Dish>;
  readonly Baskets: AsyncCollection<Basket>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Restaurant = LazyLoading extends LazyLoadingDisabled ? EagerRestaurant : LazyRestaurant

export declare const Restaurant: (new (init: ModelInit<Restaurant, RestaurantMetaData>) => Restaurant) & {
  copyOf(source: Restaurant, mutator: (draft: MutableModel<Restaurant, RestaurantMetaData>) => MutableModel<Restaurant, RestaurantMetaData> | void): Restaurant;
}

type EagerUser = {
  readonly id: string;
  readonly name: string;
  readonly address: string;
  readonly lat: number;
  readonly lng: number;
  readonly Orders?: (Order | null)[] | null;
  readonly Baskets?: (Basket | null)[] | null;
  readonly sub: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly id: string;
  readonly name: string;
  readonly address: string;
  readonly lat: number;
  readonly lng: number;
  readonly Orders: AsyncCollection<Order>;
  readonly Baskets: AsyncCollection<Basket>;
  readonly sub: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User, UserMetaData>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}