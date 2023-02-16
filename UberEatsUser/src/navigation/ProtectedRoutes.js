import React from "react";
import {Authenticator, SignIn} from "aws-amplify-react-native";
import {Button, StyleSheet, View} from "react-native";
import {useAuthContext} from "../contexts/AuthContext";
import RootNavigator from "./index";


const ProtectedRoutes = () => {

    const {authUser, googleSignin , cognitoSignIn} = useAuthContext()

    return (authUser
            ?
            <RootNavigator/>
            :
            <View style={styles.container}>
                <Authenticator hideDefault={true}>
                    <SignIn/>
                    <View >
                        <Button title="Login with Google" onPress={googleSignin}/>
                        {/*<Button title="Login with Cognito" onPress={cognitoSignIn}/>*/}
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
        // margin: 10,
        // padding: 10,
    },
});
