import React from "react";
import {Authenticator, SignIn} from "aws-amplify-react-native";
import {ActivityIndicator, Button, StyleSheet, View} from "react-native";
import {useAuthContext} from "../contexts/AuthContext";
import RootNavigator from "./index";


const ProtectedRoutes = () => {

    const {googleSignin, dbCustomer, middleware} = useAuthContext()


    if (middleware) {
        return <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" color="#96CEB4"/>
        </View>
    }

    return (dbCustomer

            ? <RootNavigator/>

            : <View style={styles.container}>
                <Authenticator hideDefault={true}>
                    <SignIn/>
                    <View style={{ flex: 4, justifyContent: "center"}}>
                        <Button color="#96CEB4" title="Login with Google" onPress={() => googleSignin()}/>
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

