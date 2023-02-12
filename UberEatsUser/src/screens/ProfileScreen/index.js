import {Alert, Button, Image, Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import React, {useEffect, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {Auth, DataStore} from "aws-amplify";
import {Customer} from '../../models'
import {useAuthContext} from "../../contexts/AuthContext";
import {useNavigation} from "@react-navigation/native";
import Geocoder from 'react-native-geocoding';
Geocoder.init(process.env.GOOGLE_API_KEY)

const Profile = () => {

    const navigation = useNavigation()
    const {dbCustomer} = useAuthContext()
    const {sub, setDbCustomer} = useAuthContext()
    const [address, setAddress] = useState()
    const [name, setName] = useState()

    useEffect(() => {
       setAddress(dbCustomer?.location?.address || "")
        setName(dbCustomer?.name || "")
    }, [dbCustomer])


    function validateSave() {
        return (address && typeof address === "string" && address?.length >= 2)
    }

    function validateCoordinates({location}) {
        return (location?.lat && location?.lng)
    }

    const onSave = async () => {
        if (!validateSave()) {
            console.error("cannot save! too short address.")
            return
        }


        switch(!!dbCustomer){

            case true:
                if(dbCustomer?.location?.address === address){
                    /**
                     * update name only
                     */
                    updateCustomer()
                    break;
                }
                /**
                 * update name and location
                 */
                Geocoder.from(address + '')
                    .then(json => {
                        const location = json?.results?.[0]?.geometry?.location
                        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ address ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(json?.results?.[0]?.['formatted_address'], null, 4))

                        if (validateCoordinates({location})) {
                            updateCustomer({
                                lat: location?.lat,
                                lng: location?.lng,
                                address: json?.results?.[0]?.['formatted_address']
                            })
                        }
                    })
            break;


            case false:
                /**
                 * create new
                 */
                Geocoder.from(address + '')
                    .then(json => {
                        const location = json?.results?.[0]?.geometry?.location
                        if (validateCoordinates({location})) {
                            createNewCustomer({lat: location?.lat, lng: location?.lng, address: json?.results?.[0]?.['formatted_address']})
                        }
                    })
            break;
        }

        navigation.navigate("Home")
    }

    const updateCustomer = ({lat, lng, address}=dbCustomer?.location) => {
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
                    sub: sub,
                    name: name,
                    location: {
                        address: address,
                        lat: parseFloat(lat),
                        lng: parseFloat(lng),
                    },
                    isDeleted: false
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
                <Image
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
                {/*<TextInput*/}
                {/*    value={lat}*/}
                {/*    onChangeText={setLat}*/}
                {/*    placeholder="Latitude"*/}
                {/*    style={styles.input}*/}
                {/*    keyboardType="numeric"*/}
                {/*/>*/}
                {/*<TextInput*/}
                {/*    value={lng}*/}
                {/*    onChangeText={setLng}*/}
                {/*    placeholder="Longitude"*/}
                {/*    style={styles.input}*/}
                {/*/>*/}
            </SafeAreaView>
            <Pressable onPress={onSave} style={styles.button} title="Save">
                <Text style={styles.buttonText}>Save</Text>
            </Pressable>
            <Text
                onPress={() => Auth.signOut()}
                style={{textAlign: "center", color: 'black', margin: 10}}>
                Sign out
            </Text>
            <Button onPress={async () => await DataStore.clear().then(async () => await DataStore.start())
            } title="Amplify.DataStore.clear()"/>

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
    button: {
        backgroundColor: "#FFAD60",
        // marginTop: "auto",
        padding: 10,
        alignItems: "center",
        marginTop: 50,
        marginRight: 10,
        marginLeft: 10,
        borderRadius: 20,
    },
    buttonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 18,
    },
});
export default Profile;
