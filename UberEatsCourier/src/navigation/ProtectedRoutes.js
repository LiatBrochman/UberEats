import React from "react";
import {Authenticator, SignIn} from "aws-amplify-react-native";
import {Button, StyleSheet, View} from "react-native";
import {useAuthContext} from "../contexts/AuthContext";
import Navigation from "./index";

const ProtectedRoutes = () => {

    const {authUser, googleSignin} = useAuthContext()

    return (authUser
            ?
            <Navigation/>
            :
            <View style={styles.container}>
                <Authenticator hideDefault={true}>
                    <SignIn/>
                    <View style={{paddingBottom:300}}>
                        <Button title="Login with Google" onPress={googleSignin}/>
                    </View>
                </Authenticator>
            </View>
    )
}
export default ProtectedRoutes
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop:25,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});