import {Alert, Button, StyleSheet, Text, TextInput} from "react-native";
import React, {useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {Auth, DataStore} from "aws-amplify";
import {Customer} from '../../models'
import {useAuthContext} from "../../contexts/AuthContext";
import {useNavigation} from "@react-navigation/native";

const Profile = () => {
    const {dbCustomer} = useAuthContext();
    const [name, setName] = useState(dbCustomer?.name || "");
    const [address, setAddress] = useState(dbCustomer?.location?.address || "");
    const [lat, setLat] = useState(dbCustomer?.location?.lat + "" || "0");
    const [lng, setLng] = useState(dbCustomer?.location?.lng + "" || "0");

    const {sub, setDbCustomer} = useAuthContext();

    const navigation = useNavigation()

    const onSave = async () => {
        if (dbCustomer) {
            await updateCustomer();
        } else {
            await createNewCustomer();
        }
        navigation.goBack()
    };

    const updateCustomer = async () => {
        const customer = await DataStore.save(
            Customer.copyOf(dbCustomer, (updated) => {
                updated.name = name
                updated.isDeleted=false
                updated.location = {
                    address: address,
                    lat: parseFloat(lat),
                    lng: parseFloat(lng),
                }
            })
        );
        setDbCustomer(customer);
    };

    const createNewCustomer = async () => {
        try {
            const customer = await DataStore.save(
                new Customer({
                    sub: sub,
                    name: name,
                    location:{
                        address: address,
                        lat: parseFloat(lat),
                        lng: parseFloat(lng)
                    },
                    isDeleted:false
                })
            );
            setDbCustomer(customer)

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
            <TextInput
                value={lat}
                onChangeText={setLat}
                placeholder="Latitude"
                style={styles.input}
                keyboardType="numeric"
            />
            <TextInput
                value={lng}
                onChangeText={setLng}
                placeholder="Longitude"
                style={styles.input}
            />
            <Button onPress={onSave} title="Save"/>
            <Text
                onPress={() => Auth.signOut()}
                style={{textAlign: "center", color: 'red', margin: 10}}>
                Sign out
            </Text>
            <Button onPress={async()=> await DataStore.clear().then(async ()=>await DataStore.start())
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
