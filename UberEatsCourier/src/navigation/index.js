import {createNativeStackNavigator} from "@react-navigation/native-stack";
import ProfileScreen from '../screens/ProfileScreen';
import MapViewScreen from "../screens/MapViewScreen";
import {useCourierContext} from "../contexts/CourierContext";


const Stack = createNativeStackNavigator()

const Navigation = () => {
    const {dbCourier} = useCourierContext()

    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            {dbCourier ? (
                <Stack.Screen name="MainStack" component={MainStackNavigator}/>
            ) : (
                <Stack.Screen name="Profile" component={ProfileScreen}/>
            )}
        </Stack.Navigator>
    )
}

const MainStackNavigator = () => {
    return (
        <MainStack.Navigator screenOptions={{headerShown: false}}>
            {/*<MainStack.Screen name="OrdersScreen" component={OrdersScreen}/>*/}
            {/*<MainStack.Screen name="OrdersDeliveryScreen" component={OrdersDeliveryScreen}/>*/}
            <MainStack.Screen name="MapViewScreen" component={MapViewScreen}/>
            <MainStack.Screen name="Profile" component={ProfileScreen}/>
        </MainStack.Navigator>
    )
}
const MainStack = createNativeStackNavigator()

export default Navigation
