import {FlatList, View} from 'react-native';
import restaurants from '../../../assets/data/restaurants.json'
import {Ionicons} from "@expo/vector-icons"
import DishListItem from '../../components/DishListItem'
import Header from './Header'
import styles from './styles'
import {useNavigation, useRoute} from "@react-navigation/native";

const restaurant = restaurants[0]

const RestaurantDetailsPage = () => {

    const route = useRoute()
    const navigation = useNavigation()

    const id = route.params?.id
    console.warn(id)

    return (
        <View style={styles.page}>
            <FlatList
                ListHeaderComponent={()=><Header restaurant={restaurant}/>}
                data={restaurant.dishes}
                renderItem={({item}) => <DishListItem dish={item}/>}
                KeyExtractor={(item) => item.name}
            />
            <Ionicons onPress={() => navigation.goBack()} name="arrow-back-circle" size={45} color="white" style={styles.iconContainer} />
        </View>
    );
};



export default RestaurantDetailsPage;
