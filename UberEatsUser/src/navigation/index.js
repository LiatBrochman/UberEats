import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import RestaurantDetailsScreen from "../screens/RestaurantDetailsScreen";
import DishDetailsScreen from "../screens/DishDetailsScreen";
import Basket from "../screens/Basket";
import OrdersScreen from "../screens/OrdersScreen";
import OrderDetails from "../screens/OrderDetails";
import ProfileScreen from "../screens/ProfileScreen";
import Map from "../screens/Map"
import {useAuthContext} from "../contexts/AuthContext";

import {AntDesign, FontAwesome5, Foundation, MaterialIcons} from "@expo/vector-icons";
import {Text} from "@react-native-material/core";




const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    const {dbCustomer} = useAuthContext();
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false, cardStyle: {
                backgroundColor: 'white'
            }
        }}>
            {dbCustomer ? (
                <Stack.Screen name="HomeTabs" component={HomeTabs}/>
            ) : (
                <Stack.Screen name="Profile" component={ProfileScreen} screenOptions={{backgroundColor: 'white'}}/>
            )}
        </Stack.Navigator>
    );
};

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{headerShown: false}}
            barStyle={{backgroundColor: "white"}}
        >
            <Tab.Screen
                name="Home"
                component={HomeStackNavigator}
                options={{
                    tabBarIcon: ({color, focused}) => (
                        focused ? <AntDesign name="home" size={24} color={"#D9534F"} />
                            :<AntDesign name="home" size={24} color={"gray"} />

                    ),
                    tabBarLabel: ({color, focused}) =>
                        focused ? (
                                <Text style={{fontSize: 10, fontWeight: "bold", color: "#D9534F"}}>HOME</Text>) :
                            <Text style={{fontSize: 10, fontWeight: "bold", color: "gray"}}>HOME</Text>

                }}/>
            <Tab.Screen
                name="Map"
                component={Map}
                options={{
                    tabBarIcon: ({color, focused}) => (
                        focused ? <Foundation name="map" size={24} color={"#D9534F"}/>
                            : <Foundation name="map" size={24} color={"gray"}/>
                    ),
                    tabBarLabel: ({color, focused}) =>
                        focused ? (
                                <Text style={{fontSize: 10, fontWeight: "bold", color: "#D9534F"}}>Map</Text>) :
                            <Text style={{fontSize: 10, fontWeight: "bold", color: "gray"}}>Map</Text>

                }}/>
            <Tab.Screen
                name="Orders"
                component={OrderStackNavigator}
                options={{
                    tabBarIcon: ({color, focused}) => (
                        focused ? <FontAwesome5 name="list-alt" size={24} color={"#D9534F"}/>
                            : <FontAwesome5 name="list-alt" size={24} color={"gray"}/>
                    ),
                    tabBarLabel: ({color, focused}) =>
                        focused ? (
                                <Text style={{fontSize: 10, fontWeight: "bold", color: "#D9534F"}}>Orders</Text>) :
                            <Text style={{fontSize: 10, fontWeight: "bold", color: "gray"}}>Orders</Text>

                }}/>
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({color, focused}) => (
                        focused ? <AntDesign name="user" size={24} color={"#D9534F"} />
                            :  <AntDesign name="user" size={24} color={"gray"} />
                    ),
                    tabBarLabel: ({color, focused}) =>
                        focused ? (
                                <Text style={{fontSize: 10, fontWeight: "bold", color: "#D9534F"}}>Profile</Text>) :
                            <Text style={{fontSize: 10, fontWeight: "bold", color: "gray"}}>Profile</Text>


                }}/>
        </Tab.Navigator>
    )
}

const HomeStack = createNativeStackNavigator();

const HomeStackNavigator = () => {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name="Restaurants" component={HomeScreen}/>
            <HomeStack.Screen name="Restaurant" component={RestaurantDetailsScreen} options={{headerShown: false}}/>
            <HomeStack.Screen name="Dish" component={DishDetailsScreen}/>
            <HomeStack.Screen name="Basket" component={Basket}/>
        </HomeStack.Navigator>
    )
}

const OrdersStack = createNativeStackNavigator();

const OrderStackNavigator = () => {
    return (
        <OrdersStack.Navigator>
            <OrdersStack.Screen name="Orders" component={OrdersScreen}/>
            <OrdersStack.Screen name="Order" component={OrderDetails}/>
            {/*<View style={{backgroundColor: "white"}}>*/}
        </OrdersStack.Navigator>
    );
};

export default RootNavigator;
