import React from "react";
import {Authenticator, SignIn} from "aws-amplify-react-native";
import {ActivityIndicator, Button, StyleSheet, View} from "react-native";
import {useAuthContext} from "../contexts/AuthContext";
import RootNavigator from "./index";
import {useCourierContext} from "../contexts/CourierContext";


const ProtectedRoutes = () => {

    const {googleSignin, middleware} = useAuthContext()
    const {dbCourier}=useCourierContext()


    if (middleware) {
        return <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" color="#96CEB4"/>
        </View>
    }

    return (dbCourier

            ? <RootNavigator/>

            : <View style={styles.container}>
                <Authenticator hideDefault={true}>
                    <SignIn/>
                    <View>
                        <Button title="Login with Google" onPress={() => googleSignin()}/>
                    </View>
                </Authenticator>
            </View>
    )
}
export default ProtectedRoutes
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 25,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
});

