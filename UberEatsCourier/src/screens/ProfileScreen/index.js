import {Alert, Button, Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import React, {useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {Amplify, Auth, DataStore} from "aws-amplify";
import {Courier, TransportationModes} from '../../models'
import {useAuthContext} from "../../contexts/AuthContext";
import {useNavigation} from "@react-navigation/native";
import {FontAwesome5, MaterialIcons} from "@expo/vector-icons";
import {useOrderContext} from "../../contexts/OrderContext";


const Profile = () => {
    const {dbCourier, setDbCourier, sub} = useAuthContext();
    const {driverLocation} = useOrderContext()
    const [name, setName] = useState(dbCourier?.name || "");
    const [transportationMode, setTransportationMode] = useState(TransportationModes.DRIVING);

    const navigation = useNavigation()

    const onSave = async () => {
        if (dbCourier) {
            await updateCourier();
        } else {
            await createCourier();
        }
        //navigation.navigate('OrdersScreen')
    };

    const updateCourier = async () => {
        const courier = await DataStore.save(
            Courier.copyOf(dbCourier, (updated) => {
                updated.name = name;
                updated.isDeleted = false;
                updated.isActive = false;
                updated.transportationMode = transportationMode;
                updated.location = {
                    address: null,
                    lat: parseFloat(driverLocation.latitude),
                    lng: parseFloat(driverLocation.longitude),
                }
            })
        );
        setDbCourier(courier);
    };

    const createCourier = async () => {
        try {
            const courier = await DataStore.save(
                new Courier({
                    sub: sub,
                    name: name,
                    transportationMode,
                    location: {
                        lat: parseFloat(driverLocation.latitude),
                        lng: parseFloat(driverLocation.longitude),
                    },
                    isDeleted: false,
                    isActive: false,
                })
            );
            setDbCourier(courier)
            console.log("\n\n success creating courier profile")
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
            <View style={{flexDirection: "row"}}>
                <Pressable
                    onPress={() => setTransportationMode(TransportationModes.BICYCLING)}
                    style={{
                        backgroundColor: transportationMode === TransportationModes.BICYCLING ? "#3FC060" : "white",
                        margin: 10,
                        padding: 10,
                        borderWidth: 1,
                        borderColor: 'grey',
                        borderRadius: 10
                    }}>
                    <MaterialIcons name="pedal-bike" size={40} color="black"/>
                </Pressable>
                <Pressable
                    onPress={() => setTransportationMode(TransportationModes.DRIVING)}
                    style={{
                        backgroundColor: transportationMode === TransportationModes.DRIVING ? "#3FC060" : "white",
                        margin: 10,
                        padding: 10,
                        borderWidth: 1,
                        borderColor: 'grey',
                        borderRadius: 10
                    }}>
                    <FontAwesome5 name="car" size={40} color="black"/>
                </Pressable>
            </View>
            <Text
                onPress={() => Auth.signOut()}
                style={{textAlign: "center", color: 'red', margin: 10}}>
                Sign out
            </Text>
            <Button onPress={onSave} title="Save"/>
            <Button
                onPress={async () => await Amplify.DataStore.clear().then(async () => await Amplify.DataStore.start())}
                title="Amplify.DataStore.clear()"/>


                <Text
                    onPress={() => navigation.navigate("OrdersScreen")}
                    style={{textAlign: "center", color: 'black', margin: 10}}>
                    return without save
                </Text>



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
