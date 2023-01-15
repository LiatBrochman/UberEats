import {createNativeStackNavigator} from "@react-navigation/native-stack";
import OrdersScreen from '../screens/OrdersScreen';
import OrdersDeliveryScreen from '../screens/OrdersDelivery';
import ProfileScreen from '../screens/ProfileScreen';
import {useAuthContext} from '../contexts/AuthContext';


const Stack = createNativeStackNavigator()

const Navigation = () => {
    const {dbCourier} = useAuthContext()

    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            {dbCourier ? (
                <>
                    <Stack.Screen name="MainStack" component={MainStackNavigator}/>
                </>
            ) : (
                <Stack.Screen name="Profile" component={ProfileScreen}/>
            )}
        </Stack.Navigator>
    )
}
const MainStackNavigator = () => {
    return (
        <MainStack.Navigator screenOptions={{headerShown: false}}>
            <MainStack.Screen name="OrdersScreen" component={OrdersScreen}/>
            <MainStack.Screen name="OrdersDeliveryScreen" component={OrdersDeliveryScreen}/>
            <MainStack.Screen name="Profile" component={ProfileScreen}/>
        </MainStack.Navigator>
    )
}
const MainStack = createNativeStackNavigator()

export default Navigation
