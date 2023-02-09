import {Button, Image, Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import React, {useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {Amplify, Auth, DataStore} from "aws-amplify";
import {Courier, TransportationModes} from '../../models'
import {useAuthContext} from "../../contexts/AuthContext";
import {useNavigation} from "@react-navigation/native";
import {FontAwesome5, MaterialIcons} from "@expo/vector-icons";
import {useOrderContext} from "../../contexts/OrderContext";
import * as Location from "expo-location";


function verifyDraft(draft) {
    return (
        typeof draft.name === 'string' &&
        typeof draft.transportationMode === 'string' &&
        typeof draft.location.lat === 'number' &&
        typeof draft.location.lng === 'number'
    )
}

const Profile = () => {
    const {dbCourier, setDbCourier, sub} = useAuthContext();
    const {driverLocation} = useOrderContext()
    const [name, setName] = useState(dbCourier?.name || "");
    const [transportationMode, setTransportationMode] = useState(dbCourier?.transportationMode || "DRIVING");

    const navigation = useNavigation()


    const onSave = async () => {
        const draft = {
            name, transportationMode, location: {
                lat: parseFloat(driverLocation?.latitude),
                lng: parseFloat(driverLocation?.longitude)
            }}
        if (!verifyDraft(draft)) {
            console.error("\n\n ~~~~~~~~~~~~~~~~~~~~~ your trying to save an invalid courier ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(draft), null, 4)
            return null
        }
        if (dbCourier) {
            await updateCourier(draft)
        } else {
            draft.isDeleted = false
            draft.isActive = true
            draft.location.address = "null"
            draft.sub = sub
            await createCourier(draft)
        }
        navigation.navigate('OrdersScreen')
    }

    const updateCourier = async draft => {
        DataStore.save(Courier.copyOf(dbCourier, updated => Object.assign(updated, draft)))
            .then(setDbCourier)
    }

    const createCourier = async draft => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ draft on create a new Courier ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(draft, null, 4))
        DataStore.save(new Courier(draft))
            .then(setDbCourier)
    }

    return (
        <View style={{backgroundColor: "white", flex: 1}}>
            <Text style={styles.title}>Profile</Text>
            <Image
                source={{
                    uri: "https://images.unsplash.com/photo-1595509552179-488a7a58e818?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=545&q=80"
                }}
                style={styles.image}
            />
            <SafeAreaView>
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
                            backgroundColor: "white",
                            margin: 10,
                            padding: 10,
                            borderWidth: 2,
                            borderColor: transportationMode === TransportationModes.BICYCLING ? "#96CEB4" : "lightgray",
                            borderRadius: 30
                        }}>
                        <MaterialIcons name="pedal-bike" size={25}
                                       color={transportationMode === TransportationModes.BICYCLING ? "#96CEB4" : "lightgray"}/>
                    </Pressable>
                    <Pressable
                        onPress={() => setTransportationMode(TransportationModes.DRIVING)}
                        style={{
                            backgroundColor: "white",
                            margin: 10,
                            padding: 10,
                            borderWidth: 2,
                            borderColor: transportationMode === TransportationModes.DRIVING ? "#96CEB4" : "lightgray",
                            borderRadius: 30
                        }}>
                        <FontAwesome5 name="car" size={25}
                                      color={transportationMode === TransportationModes.DRIVING ? "#96CEB4" : "lightgray"}/>
                    </Pressable>
                </View>

                <Pressable onPress={onSave} style={styles.buttonSave}>
                    <Text style={styles.buttonText}>Save</Text>
                </Pressable>
                <Pressable onPress={() => navigation.navigate("OrdersScreen")} style={styles.buttonReturn}>
                    <Text style={styles.buttonText}>return without save</Text>
                </Pressable>
                <Text
                    onPress={() => Auth.signOut()}
                    style={{textAlign: "center", color: 'black', margin: 10}}>
                    Sign out
                </Text>
                <Button
                    onPress={async () => await Amplify.DataStore.clear().then(async () => await Amplify.DataStore.start())}
                    title="Amplify.DataStore.clear()"/>


            </SafeAreaView>
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
    input: {
        margin: 10,
        backgroundColor: "#f7f7f7",
        padding: 10,
        borderRadius: 10,
        borderColor: "gray"
    },
    image: {
        width: "100%",
        aspectRatio: 5 / 3,
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
    },
    buttonSave: {
        backgroundColor: "#FFAD60",
        marginTop: "auto",
        padding: 10,
        alignItems: "center",
        margin: 10,
        borderRadius: 20,
    },
    buttonReturn: {
        backgroundColor: "#FFEEAD",
        marginTop: "auto",
        padding: 10,
        alignItems: "center",
        margin: 10,
        borderRadius: 20,
    },
});

export default Profile;
