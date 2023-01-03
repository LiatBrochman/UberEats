import {View, Text, TextInput, StyleSheet, Button, Alert} from "react-native";
import React, {useEffect, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {Amplify, Auth, DataStore, Predicates} from "aws-amplify";
import {Basket, Dish, Customer} from '../../models'
import {useAuthContext} from "../../contexts/AuthContext";
import {useNavigation} from "@react-navigation/native";
// import {useBasketContext} from "../../contexts/BasketContext";

const Profile = () => {
    const {dbCustomer} = useAuthContext();
    // const {clearBasketContext} = useBasketContext();
    const [name, setName] = useState(dbCustomer?.name || "");
    const [address, setAddress] = useState(dbCustomer?.location?.address || "");
    const [lat, setLat] = useState(dbCustomer?.location?.lat + "" || "0");
    const [lng, setLng] = useState(dbCustomer?.location?.lng + "" || "0");

    const {sub, setDbCustomer} = useAuthContext();

    const navigation = useNavigation()

    const onSave = async () => {
        //console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ dbCustomer ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(dbCustomer,null,4))
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

            {/*{*/}
            {/*    <Button onPress={async () => {*/}
            {/*        await Promise.allSettled([*/}
            {/*            // DataStore.delete(BasketDish, Predicates.ALL),*/}
            {/*            DataStore.delete(Basket, Predicates.ALL),*/}
            {/*            DataStore.delete(Dish, Predicates.ALL),*/}
            {/*        ])*/}
            {/*        clearBasketContext()*/}

            {/*    }} title="remove all baskets + dishes from DB"/>*/}

            {/*    <Button onPress={async () => {*/}

            {/*    const res = await DataStore.save(*/}
            {/*    new Dish({*/}
            {/*    name: "Pancake",*/}
            {/*    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2580&q=80",*/}
            {/*    description: "...",*/}
            {/*    price: Number(10.0),*/}
            {/*    restaurantID: "08150edf-2839-47ff-aedf-3bda9d476bbd"*/}
            {/*}*/}
            {/*    )*/}
            {/*    )*/}
            {/*    console.log("\n\n\n^^^^^^^^^^^^^^^^^^^ added:", res)*/}
            {/*}} title="add dish"/>*/}

            {/*    <Button onPress={async () => {*/}

            {/*    const res = await DataStore.save(*/}
            {/*    new Basket({*/}
            {/*    CustomerID: dbCustomer.id,*/}
            {/*    restaurantID: "08150edf-2839-47ff-aedf-3bda9d476bbd"*/}
            {/*})*/}
            {/*    )*/}
            {/*    console.log("\n\n\n^^^^^^^^^^^^^^^^^^^ added:", res)*/}
            {/*}} title="create an empty basket"/>*/}

            {/*    <Button onPress={async () => await Amplify.DataStore.clear()} title="Amplify.DataStore.clear()"/>*/}
            {/*}*/}
            <Button onPress={()=>Amplify.DataStore.clear()} title="Amplify.DataStore.clear()"/>
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
