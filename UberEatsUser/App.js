import {StatusBar} from 'expo-status-bar';
import RootNavigator from "./src/navigation";

import { NavigationContainer } from '@react-navigation/native';
import {Amplify} from 'aws-amplify';
import { withAuthenticator } from "aws-amplify-react-native";
import config from './src/aws-exports';
import AuthContextProvider from "./src/contexts/AuthContext";
import BasketContextProvider from "./src/contexts/BasketContext";
import OrderContextProvider from "./src/contexts/OrderContext";
import RestaurantContextProvider from "./src/contexts/RestaurantContext";
import DishContextProvider from "./src/contexts/DishContext";

Amplify.configure({...config, Analytics: {disabled:true,},})

function App() {
    return (
<NavigationContainer>
    <AuthContextProvider>
        <RestaurantContextProvider>
        <BasketContextProvider>
            <OrderContextProvider>
                <DishContextProvider>
                <RootNavigator/>
                    </DishContextProvider>
            </OrderContextProvider>
        </BasketContextProvider>
        </RestaurantContextProvider>
    </AuthContextProvider>
            <StatusBar style="light"/>
</NavigationContainer>
    );
}

export default withAuthenticator(App);


