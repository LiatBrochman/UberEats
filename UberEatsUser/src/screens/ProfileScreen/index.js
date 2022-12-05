import {View, Text, TextInput, StyleSheet, Button, Alert} from "react-native";
import React, {useEffect, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {Amplify, Auth, DataStore, Predicates} from "aws-amplify";
import {BasketDish, Basket, Dish, User} from '../../models'
import {useAuthContext} from "../../contexts/AuthContext";
import {useNavigation} from "@react-navigation/native";
import {useBasketContext} from "../../contexts/BasketContext";

const Profile = () => {
    const {dbUser} = useAuthContext();
    const {clearBasketContext} = useBasketContext();
    const [name, setName] = useState(dbUser?.name || "");
    const [address, setAddress] = useState(dbUser?.address || "");
    const [lat, setLat] = useState(dbUser?.lat + "" || "0");
    const [lng, setLng] = useState(dbUser?.lng + "" || "0");

    const {sub, setDbUser} = useAuthContext();

    const navigation = useNavigation()

    const onSave = async () => {
        console.log("dbUser:", dbUser)
        if (dbUser) {
            await updateUser();
        } else {
            await createUser();
        }
        navigation.goBack()
    };

    const updateUser = async () => {
        const user = await DataStore.save(
            User.copyOf(dbUser, (updated) => {
                updated.name = name;
                updated.address = address;
                updated.lat = parseFloat(lat);
                updated.lng = parseFloat(lng);
            })
        );
        setDbUser(user);
    };

    const createUser = async () => {
        try {
            const user = await DataStore.save(
                new User({
                    sub: sub,
                    name: name,
                    address: address,
                    lat: parseFloat(lat),
                    lng: parseFloat(lng),
                })
            );
            setDbUser(user)
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


            <Button onPress={async () => {
                await Promise.allSettled([
                    DataStore.delete(BasketDish, Predicates.ALL),
                    DataStore.delete(Basket, Predicates.ALL),
                    DataStore.delete(Dish, Predicates.ALL),
                ])

                clearBasketContext()

            }} title="clean all baskets + dishes + basketDishes"/>

            <Button onPress={async () => {

                const res = await DataStore.save(
                    new Dish({
                            name: "Pancake",
                            image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2580&q=80",
                            description: "...",
                            price: Number(10.0),
                            restaurantID: "08150edf-2839-47ff-aedf-3bda9d476bbd"
                        }
                    )
                )
                console.log("\n\n\n^^^^^^^^^^^^^^^^^^^ added:", res)
            }} title="add dish"/>

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
