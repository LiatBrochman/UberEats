import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from 'react-native';
import orders from "./assets/data/orders.json";

import OrderScreen from "./src/screens/OrderScreen";
import { FlatList } from 'react-native-gesture-handler'


export default function App() {
    return (
        <View style={styles.container}>
            <OrderScreen />
            <StatusBar style="auto"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
});
