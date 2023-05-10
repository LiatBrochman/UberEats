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
                <View style={{justifyContent: "center"}}>
                    <Button color="#96CEB4" title="Login with Google" onPress={() => googleSignin()}/>
                </View>
                <View style={{paddingBottom:200}}></View>
            </Authenticator>
        </View>

    useEffect(() => {


        isLoading ?
            setRenderingScreen(loadingScreen) :
            authUser ?
                setRenderingScreen(<RootNavigator/>) : setRenderingScreen(loginScreen)


    }, [isLoading, authUser])


    return renderingScreen

    // if (isLoading) {
    //     return <View style={[styles.container, styles.horizontal]}>
    //         <ActivityIndicator size="large" color="#96CEB4"/>
    //     </View>
    // }
    //
    // return (dbCourier
    //
    //         ? <RootNavigator/>
    //
    //         : <View style={styles.container}>
    //             <Authenticator hideDefault={true}>
    //                 <SignIn/>
    //                 <View style={{ flex: 1, justifyContent: "center"}}>
    //                     <Button color="#96CEB4" title="Login with Google" onPress={() => googleSignin()}/>
    //                 </View>
    //             </Authenticator>
    //         </View>
    // )
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

