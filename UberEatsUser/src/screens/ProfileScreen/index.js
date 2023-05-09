import {Alert, Button, Image, Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import React, {useEffect, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {DataStore} from "aws-amplify";
import {Customer} from '../../models'
import {useAuthContext} from "../../contexts/AuthContext";
import {useNavigation} from "@react-navigation/native";
import {getAddressByCoords, getCoordsByAddress, getCurrentPosition} from "../../myExternalLibrary/LocationFunctions";
import CachedImage from 'react-native-expo-cached-image';


const Profile = () => {

    const navigation = useNavigation()
    const {dbCustomer, authUser, setDbCustomer, signOut} = useAuthContext()
    const [address, setAddress] = useState()
    const [name, setName] = useState()


    useEffect(() => {
        setAddress(dbCustomer?.location?.address || "")
        setName(dbCustomer?.name || authUser?.attributes?.name || "")
    }, [dbCustomer])

    function validateSave() {
        return (address && typeof address === "string" && address?.length >= 2)
    }

    const onSave = async () => {
        if (!validateSave()) {
            console.error("cannot save! too short address.")
            return
        }


        switch (!!dbCustomer) {

            case true:
                if (dbCustomer?.location?.address === address) {
                    /**
                     * update name only
                     */
                    updateCustomer(dbCustomer.location)
                    break;
                }
                /**
                 * update name and location
                 */

                const coords = await getCoordsByAddress(address)
                const fixedAddress = await getAddressByCoords(coords)
                updateCustomer({
                    lat: coords?.latitude,
                    lng: coords?.longitude,
                    address: fixedAddress
                })
                break;


            case false:

                /**
                 * create a new Customer
                 */

                switch (!!address) {


                    /**
                     * if address was set manually
                     */
                    case true:
                        const coords = await getCoordsByAddress(address)
                        const fixedAddress = await getAddressByCoords(coords)
                        createNewCustomer({
                            lat: coords?.latitude,
                            lng: coords?.longitude,
                            address: fixedAddress,
                            email: authUser.email
                        })
                        break;


                    /**
                     * if address is empty
                     */
                    case false:
                            console.error('no address has been inserted')

                        break;
                }

                break;
        }

        navigation.navigate("Home")
    }

    const updateCustomer = ({lat, lng, address}) => {
        DataStore.query(Customer, dbCustomer.id).then(dbCustomer =>
            DataStore.save(
                Customer.copyOf(dbCustomer, (updated) => {
                    updated.name = name
                    updated.isDeleted = false
                    updated.location = {
                        address: address,
                        lat: parseFloat(lat),
                        lng: parseFloat(lng),
                    }
                })
            ).then(setDbCustomer)
        )

    }

    const createNewCustomer = ({lat, lng, address}) => {
        try {
            DataStore.save(
                new Customer({
                    sub: authUser.attributes.sub,
                    name: name,
                    location: {
                        address: address,
                        lat: parseFloat(lat),
                        lng: parseFloat(lng),
                    },
                    isDeleted: false,
                    email: authUser.attributes.email
                })
            ).then(setDbCustomer)

        } catch (e) {
            Alert.alert("Error", e.message);
        }
    }


    return (
        <View style={{backgroundColor: "white", flex: 1}}>
            <SafeAreaView>
                <Text style={styles.title}>Profile</Text>
                <CachedImage
                    source={{
                        uri: "https://images.unsplash.com/photo-1487700160041-babef9c3cb55?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2052&q=80"
                    }}
                    style={styles.image}
                />
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Name"
                    style={styles.input}
                />
                <TextInput
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Address"
                    style={styles.input}
                />
            </SafeAreaView>
            <Pressable onPress={async () => setAddress(await getAddressByCoords( await getCurrentPosition()))} style={styles.buttonGetMyLocation} title="Get My Location">
                <Text style={styles.buttonText}>Get My Location</Text>
            </Pressable>
            <Pressable onPress={onSave} style={styles.buttonSave} title="Save">
            <Text style={styles.buttonText}>Save</Text>
        </Pressable>
            <Text
                onPress={signOut}
                style={{textAlign: "center", color: 'black', margin: 10}}>
                Sign out
            </Text>

            {process.env.NODE_ENV!=="production" &&
            <Button onPress={async () => await DataStore.clear().then(async () => await DataStore.start())
            } title="Amplify.DataStore.clear()"/>}

        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        margin: 10,
    },
    image: {
        width: "100%",
        aspectRatio: 5 / 3,
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
    },
    input: {
        margin: 10,
        backgroundColor: "#f7f7f7",
        padding: 10,
        borderRadius: 10,
        borderColor: "gray"
    },
    buttonGetMyLocation: {
        backgroundColor: "#96CEB4",
        // marginTop: "auto",
        padding: 10,
        alignItems: "center",
        marginTop: 15,
        marginRight: 10,
        marginLeft: 10,
        borderRadius: 20,
    },
    buttonSave: {
        backgroundColor: "#FFAD60",
        // marginTop: "auto",
        padding: 10,
        alignItems: "center",
        marginTop: 15,
        marginRight: 10,
        marginLeft: 10,
        borderRadius: 20,
    },
    buttonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 16,
    },
});
export default Profile;
