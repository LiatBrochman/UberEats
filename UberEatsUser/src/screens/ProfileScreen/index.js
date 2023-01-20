import {Alert, Button, StyleSheet, Text, TextInput} from "react-native";
import React, {useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {Auth, DataStore} from "aws-amplify";
import {Customer} from '../../models'
import {useAuthContext} from "../../contexts/AuthContext";
import {useNavigation} from "@react-navigation/native";
import {GOOGLE_API_KEY} from '@env';
import Geocoder from 'react-native-geocoding';


const Profile = () => {

    const {dbCustomer} = useAuthContext()
    const [name, setName] = useState(dbCustomer?.name || "")
    const [address, setAddress] = useState(dbCustomer?.location?.address || "")
    const {sub, setDbCustomer} = useAuthContext()
    const navigation = useNavigation()


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

        Geocoder.init(GOOGLE_API_KEY)
        Geocoder.from(address + '')
            .then(json => {
                const location = json?.results?.[0]?.geometry?.location

                if (validateCoordinates({location})) {

                    if (dbCustomer) {
                        updateCustomer({lat: location.lat, lng: location.lng, address: address})
                    } else {
                        createNewCustomer({lat: location.lat, lng: location.lng, address: address})
                    }

                    navigation.navigate("Home")
                } else {
                    console.error("coordinates are not valid!")
                }
            })
            .catch(error => console.warn(error))


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
        <SafeAreaView>
            <Text style={styles.title}>Profile</Text>
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
            <Button onPress={onSave} title="Save"/>
            <Text
                onPress={() => Auth.signOut()}
                style={{textAlign: "center", color: 'red', margin: 10}}>
                Sign out
            </Text>
            <Button onPress={async () => await DataStore.clear().then(async () => await DataStore.start())
            } title="Amplify.DataStore.clear()"/>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        margin: 10,
    },
    input: {
        margin: 10,
        backgroundColor: "white",
        padding: 15,
        borderRadius: 5,
    },
});
export default Profile;
