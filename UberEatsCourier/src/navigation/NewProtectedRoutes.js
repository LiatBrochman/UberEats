import React, {useEffect, useState} from 'react';
import {Authenticator} from '@aws-amplify/ui-react-native';
import {ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useAuthContext} from "../contexts/AuthContext";
import RootNavigator from "./index";

export const NewProtectedRoutes = () => {

    const {googleSignin, isLoading, authUser} = useAuthContext()
    const [renderingScreen, setRenderingScreen] = useState(<></>)

    const loadingScreen =
        <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" color="#96CEB4"/>
        </View>

    const GoogleButton = () => (
        <TouchableOpacity onPress={googleSignin} style={styles.button}>
            <View style={styles.buttonContainer}>
                <Image
                    source={require('../../assets/google_icon.png')}
                    style={styles.icon}
                    resizeMode="contain"
                />
                <Text style={styles.text}>Sign In with Google</Text>
            </View>
        </TouchableOpacity>
    );


    const loginScreen =
        <View style={styles.container}>
            <Authenticator.Provider>
                <Authenticator Footer={GoogleButton}/>
            </Authenticator.Provider>
        </View>


    useEffect(() => {

        isLoading ?
            setRenderingScreen(loadingScreen) :
            authUser ?
                setRenderingScreen(<RootNavigator/>) : setRenderingScreen(loginScreen)


    }, [isLoading, authUser])


    return renderingScreen

}
const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 4,
        borderWidth: 1, // Add border width
        borderColor: 'black', // Add border color
        width: '50%', // Adjust the width as needed
        marginVertical: "5%", // Add margin for vertical spacing
        marginHorizontal: "25%",
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    text: {
        color: 'black',
        // fontWeight: 'bold',
    },
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
