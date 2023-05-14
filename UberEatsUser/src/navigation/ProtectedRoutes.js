import React, {useEffect, useState} from "react";
import {Authenticator, SignIn} from "aws-amplify-react-native";
import {ActivityIndicator, Button, StyleSheet, View} from "react-native";
import {useAuthContext} from "../contexts/AuthContext";
import RootNavigator from "./index";


const ProtectedRoutes = () => {

    const {googleSignin, isLoading, authUser} = useAuthContext()
    const [renderingScreen, setRenderingScreen] = useState(<></>)
    const loadingScreen = <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#96CEB4"/></View>
    const loginScreen = <View style={styles.container}>
            <Authenticator hideDefault={true}>
                <SignIn/>
                <View>
                    <Button color="#96CEB4" title="Login with Google" onPress={() => googleSignin()}/>
                </View>
                {/*<View style={{paddingBottom:70}}></View>*/}
            </Authenticator>
        </View>


    useEffect(() => {

        isLoading ?
            setRenderingScreen(loadingScreen) :
            authUser ?
                setRenderingScreen(<RootNavigator/>) : setRenderingScreen(loginScreen)


    }, [isLoading, authUser])

    return renderingScreen

}
export default ProtectedRoutes
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: 10,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom:30
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
});

