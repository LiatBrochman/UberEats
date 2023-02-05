import {FlatList, StyleSheet, View} from "react-native";
import RestaurantItem from "../../components/RestaurantItem";
import {useRestaurantContext} from "../../contexts/RestaurantContext";


// export var subscription = {}

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
        backgroundColor: "white"
    },
});
