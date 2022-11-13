import {Text, View} from "react-native";
import styles from '../Basket/style'

const BasketDishItem = ({BasketDish}) => {
    return (
        <View style={styles.row}>
            <View style={styles.quantityContainer}>
                <Text>1</Text>
            </View>
            <Text style={styles.basketDishName}>{BasketDish.name}</Text>
            <Text style={styles.basketDishPrice}>$ {BasketDish.price}</Text>
        </View>
    )
}

export default BasketDishItem;
