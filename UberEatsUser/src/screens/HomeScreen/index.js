import {useState, useEffect} from "react";
import { StyleSheet, FlatList, View } from "react-native";
import RestaurantItem from "../../components/RestaurantItem";
import {getAllRestaurants} from "../../contexts/Queries";
import {useRestaurantContext} from "../../contexts/RestaurantContext";

export default function HomeScreen() {
    const {allRestaurants} = useRestaurantContext()
    // const [restaurants,setRestaurants] = useState([]);


    // useEffect(()=>{
    //     // DataStore.query(Restaurant,restaurant=> restaurant.isDeleted.eq(false))
    //         // .then(setRestaurants)
    //     getAllRestaurants()
    //         .then(restaurants=>{
    //             console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ HomeScreen restaurants ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(restaurants,null,4))
    //             restaurants instanceof Array && setRestaurants(restaurants)
    //         })
    // },[]);

    return (
        <View style={styles.page}>
            <FlatList
                data={allRestaurants}
                renderItem={({item}) =><RestaurantItem restaurant={item} />}
                showsVerticalScrollIndicator={false}
            />
        </View>

    );
}

const styles = StyleSheet.create({
    page:{
        padding: 10,
    },
});
