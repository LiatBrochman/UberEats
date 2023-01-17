import {useState, useEffect} from "react";
import {StyleSheet, FlatList, View, Pressable, Text} from "react-native";
import RestaurantItem from "../../components/RestaurantItem";
import {Amplify, DataStore, Predicates} from "aws-amplify";
import {Dish, Basket, Restaurant} from "../../models";
import * as Updates from 'expo-updates';
import {useRestaurantContext} from "../../contexts/RestaurantContext";

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

export var subscription = {}

export default function HomeScreen() {
    const {restaurants} = useRestaurantContext()


    return (
        <View style={styles.page}>
            <FlatList
                data={restaurants}
                renderItem={({item}) => <RestaurantItem restaurant={item}/>}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        padding: 10,
    },
});
