import {useState} from "react";
import {Text, View, StyleSheet, FlatList} from 'react-native';
import restaurants from '../../../assets/data/restaurants.json';
import BasketDishItem from '../Basket/BasketDishItem'
import styles from '../Basket/style'

const restaurant = restaurants[0];



const Basket = () => {

    return (
        <View style={styles.page}>
            <Text style={styles.name}>{restaurant.name}</Text>
            <Text style={styles.title}>Your items</Text>
            <FlatList data={restaurant.dishes} renderItem={({item}) => <BasketDishItem BasketDish={item}/>}/>
            <View style={styles.separator}/>
            <View style={styles.button}>
                <Text style={styles.buttonText}>Create order</Text>
            </View>
        </View>
    )
};

export default Basket;



