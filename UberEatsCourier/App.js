import {StatusBar} from "expo-status-bar";
import {View, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native'
import Navigation from './src/navigation'



export default function App() {
    return (
        <NavigationContainer>
                <Navigation/>
                <StatusBar style="auto"/>
        </NavigationContainer>
    );
};

