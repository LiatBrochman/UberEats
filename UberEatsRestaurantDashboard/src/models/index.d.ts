import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection } from "@aws-amplify/datastore";

export enum OrderStatus {
  NEW = "NEW",
  COOKING = "COOKING",
  READY_FOR_PICKUP = "READY_FOR_PICKUP",
  PICKED_UP = "PICKED_UP",
  COMPLETED = "COMPLETED",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED"
}

export enum TransportationModes {
  DRIVING = "DRIVING",
  BICYCLING = "BICYCLING"
}

type EagerLocation = {
  readonly address?: string | null;
  readonly lat: number;
  readonly lng: number;
}

type LazyLocation = {
  readonly address?: string | null;
  readonly lat: number;
  readonly lng: number;
}

export declare type Location = LazyLoading extends LazyLoadingDisabled ? EagerLocation : LazyLocation

export declare const Location: (new (init: ModelInit<Location>) => Location)

type EagerOwner = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Owner, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub: string;
  readonly isDeleted: boolean;
  readonly Restaurants?: (Restaurant | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyOwner = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Owner, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub: string;
  readonly isDeleted: boolean;
  readonly Restaurants: AsyncCollection<Restaurant>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Owner = LazyLoading extends LazyLoadingDisabled ? EagerOwner : LazyOwner

export declare const Owner: (new (init: ModelInit<Owner>) => Owner) & {
  copyOf(source: Owner, mutator: (draft: MutableModel<Owner>) => MutableModel<Owner> | void): Owner;
}

type EagerRestaurant = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Restaurant, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly image?: string | null;
  readonly deliveryFee: number;
  readonly minDeliveryMinutes?: number | null;
  readonly maxDeliveryMinutes?: number | null;
  readonly rating?: number | null;
  readonly location: Location;
  readonly isOpen: boolean;
  readonly isDeleted: boolean;
  readonly Dishes?: (Dish | null)[] | null;
  readonly Orders?: (Order | null)[] | null;
  readonly Baskets?: (Basket | null)[] | null;
  readonly ownerID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyRestaurant = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Restaurant, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly image?: string | null;
  readonly deliveryFee: number;
  readonly minDeliveryMinutes?: number | null;
  readonly maxDeliveryMinutes?: number | null;
  readonly rating?: number | null;
  readonly location: Location;
  readonly isOpen: boolean;
  readonly isDeleted: boolean;
  readonly Dishes: AsyncCollection<Dish>;
  readonly Orders: AsyncCollection<Order>;
  readonly Baskets: AsyncCollection<Basket>;
  readonly ownerID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Restaurant = LazyLoading extends LazyLoadingDisabled ? EagerRestaurant : LazyRestaurant

export declare const Restaurant: (new (init: ModelInit<Restaurant>) => Restaurant) & {
  copyOf(source: Restaurant, mutator: (draft: MutableModel<Restaurant>) => MutableModel<Restaurant> | void): Restaurant;
}

type EagerDish = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Dish, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly image?: string | null;
  readonly description?: string | null;
  readonly price: number;
  readonly extra?: string | null;
  readonly quantity: number;
  readonly isActive: boolean;
  readonly isDeleted: boolean;
  readonly orderID?: string | null;
  readonly restaurantID: string;
  readonly basketID?: string | null;
  readonly originalID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyDish = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Dish, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly image?: string | null;
  readonly description?: string | null;
  readonly price: number;
  readonly extra?: string | null;
  readonly quantity: number;
  readonly isActive: boolean;
  readonly isDeleted: boolean;
  readonly orderID?: string | null;
  readonly restaurantID: string;
  readonly basketID?: string | null;
  readonly originalID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Dish = LazyLoading extends LazyLoadingDisabled ? EagerDish : LazyDish

export declare const Dish: (new (init: ModelInit<Dish>) => Dish) & {
  copyOf(source: Dish, mutator: (draft: MutableModel<Dish>) => MutableModel<Dish> | void): Dish;
}

type EagerOrder = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Order, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly status: OrderStatus | keyof typeof OrderStatus;
  readonly totalQuantity: number;
  readonly totalPrice: number;
  readonly customerLocation: Location;
  readonly restaurantLocation: Location;
  readonly isDeleted: boolean;
  readonly Dishes?: (Dish | null)[] | null;
  readonly customerID: string;
  readonly courierID: string;
  readonly restaurantID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyOrder = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Order, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly status: OrderStatus | keyof typeof OrderStatus;
  readonly totalQuantity: number;
  readonly totalPrice: number;
  readonly customerLocation: Location;
  readonly restaurantLocation: Location;
  readonly isDeleted: boolean;
  readonly Dishes: AsyncCollection<Dish>;
  readonly customerID: string;
  readonly courierID: string;
  readonly restaurantID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Order = LazyLoading extends LazyLoadingDisabled ? EagerOrder : LazyOrder

export declare const Order: (new (init: ModelInit<Order>) => Order) & {
  copyOf(source: Order, mutator: (draft: MutableModel<Order>) => MutableModel<Order> | void): Order;
}

type EagerBasket = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Basket, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly isDeleted: boolean;
  readonly customerID: string;
  readonly Dishes?: (Dish | null)[] | null;
  readonly restaurantID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyBasket = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Basket, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly isDeleted: boolean;
  readonly customerID: string;
  readonly Dishes: AsyncCollection<Dish>;
  readonly restaurantID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Basket = LazyLoading extends LazyLoadingDisabled ? EagerBasket : LazyBasket

export declare const Basket: (new (init: ModelInit<Basket>) => Basket) & {
  copyOf(source: Basket, mutator: (draft: MutableModel<Basket>) => MutableModel<Basket> | void): Basket;
}

type EagerCustomer = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Customer, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly location: Location;
  readonly sub: string;
  readonly isDeleted: boolean;
  readonly Orders?: (Order | null)[] | null;
  readonly Baskets?: (Basket | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCustomer = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Customer, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly location: Location;
  readonly sub: string;
  readonly isDeleted: boolean;
  readonly Orders: AsyncCollection<Order>;
  readonly Baskets: AsyncCollection<Basket>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Customer = LazyLoading extends LazyLoadingDisabled ? EagerCustomer : LazyCustomer

export declare const Customer: (new (init: ModelInit<Customer>) => Customer) & {
  copyOf(source: Customer, mutator: (draft: MutableModel<Customer>) => MutableModel<Customer> | void): Customer;
}

type EagerCourier = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Courier, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly sub?: string | null;
  readonly transportationMode?: TransportationModes | keyof typeof TransportationModes | null;
  readonly location: Location;
  readonly Orders?: (Order | null)[] | null;
  readonly isDeleted: boolean;
  readonly isActive: boolean;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCourier = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Courier, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly sub?: string | null;
  readonly transportationMode?: TransportationModes | keyof typeof TransportationModes | null;
  readonly location: Location;
  readonly Orders: AsyncCollection<Order>;
  readonly isDeleted: boolean;
  readonly isActive: boolean;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Courier = LazyLoading extends LazyLoadingDisabled ? EagerCourier : LazyCourier

export declare const Courier: (new (init: ModelInit<Courier>) => Courier) & {
  copyOf(source: Courier, mutator: (draft: MutableModel<Courier>) => MutableModel<Courier> | void): Courier;
}