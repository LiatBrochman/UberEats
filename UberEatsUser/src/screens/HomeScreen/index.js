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
    // const [restaurants, setRestaurants] = useState([])
    //
    //
    // useEffect(() => {
    //     subscription.restaurants = DataStore.observeQuery(Restaurant, r => r.isDeleted.eq(false)).subscribe(({items}) => {
    //         if (items?.length) {
    //             setRestaurants(items)
    //         }
    //     })
    // }, [])


    return (
        <View style={styles.page}>
            <FlatList
                data={restaurants}
                renderItem={({item}) => <RestaurantItem restaurant={item}/>}
                showsVerticalScrollIndicator={false}
            />
            <Pressable
                style={{

                    backgroundColor: "black",
                    marginBottom: "auto",
                    padding: 20,
                    alignItems: "center",
                    margin: 10,


                }}
                onPress={async () => {

                    await Amplify.DataStore.delete(Basket, Predicates.ALL)
                    await Amplify.DataStore.delete(Dish, d => d?.quantity.lt(99))
                    await DataStore.clear().then(async () => await DataStore.start()
                        .then(() => sleep(5000).then(async () => await Updates.reloadAsync())))

                }}

            >
                <Text style={{

                    color: "white",
                    fontWeight: "600",
                    fontSize: 18,

                }}>del basket</Text>
            </Pressable>
        </View>

    );
}

const styles = StyleSheet.create({
    page: {
        padding: 10,
    },
});
