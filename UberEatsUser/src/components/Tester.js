import React, {useState} from 'react';
import {Alert, Modal, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {DataStore} from "@aws-amplify/datastore";
import {Courier, Order} from "../models";

async function acceptOrderAsTester(order) {

    const nextStatus = getNextStatus(order)

    if (nextStatus === null) return;

    return DataStore.query(Order, order.id)
        .then(order => DataStore.save(
                Order.copyOf(order, (updated) => {
                    updated.status = nextStatus
                })
            )
                .then(async () =>
                    await new Promise(resolve =>
                        setTimeout(async () => {

                            resolve(true)

                        }, 1000)
                    )
                )
        )

}

function getNextStatus(order) {
    switch (order.status) {
        case "NEW":
            return "ACCEPTED"

        case "ACCEPTED":
            return "COOKING"

        case "COOKING":
            return "READY_FOR_PICKUP"

        case "READY_FOR_PICKUP":
            if (order?.courierID && order.courierID !== "null") {
                return "PICKED_UP"
            }
            Alert.alert("The Order Has To Be Assigned To A Courier In Order To Proceed!")
            return null

        case "PICKED_UP":
            if (order?.courierID && order.courierID !== "null") {
                return "COMPLETED"
            }
            Alert.alert("The Order Has To Be Assigned To A Courier In Order To Proceed!")
            return null
    }

}

// const Tester = ({order}) => {
//     const [toggleTester, setToggleTester] = useState(false)
//     const [isDisabled, setIsDisabled] = useState(true)
//     const handlePress = () => {
//         if (!isDisabled) {
//             setIsDisabled(true)
//             acceptOrderAsTester(order).then(() => {
//                 setIsDisabled(false)
//                 setToggleTester(false)
//             })
//         }
//     }
//
//     return (
//         <>
//             <Text style={styles.text}>Tester ...</Text>
//             {!toggleTester ? (
//                 <Pressable style={styles.redButton} onPress={() => setToggleTester(true)}>
//                     <Text style={styles.textClick}>Tester?</Text>
//                 </Pressable>
//             ) : (
//                 <View>
//                     <Text style={styles.text}> current status: {order.status}</Text>
//                     <Pressable style={styles.redButton} onPress={handlePress} disabled={isDisabled}>
//                         <Text style={styles.text}>Click to proceed the next status</Text>
//                     </Pressable>
//                 </View>
//
//             )}
//         </>
//     )
// }
//
// const styles = StyleSheet.create({
//     container: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 10,
//     },
//     row: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 10,
//     },
//     text: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: 'black',
//         textAlign: 'center',
//         // paddingVertical: "35%",
//     },
//     textClick: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: 'white',
//         textAlign: 'center',
//         paddingVertical: "35%",
//     },
//     redButton: {
//         backgroundColor: "#D9534F",
//         margin: "40%",
//         alignItems: "center",
//         marginTop: 15,
//         width: "20%",
//         height: "11%",
//         borderRadius: 80,
//     },
// })
//
// export default Tester;

const Tester = ({order}) => {
    const [isDisabled, setIsDisabled] = useState(false)
    const [toggleModal, setToggleModal] = useState(false)

    const handlePress = async () => {
        if (!isDisabled) {
            setIsDisabled(true)
            acceptOrderAsTester(order).then(() => setIsDisabled(false))
        }
    }

    const handleNextStatusPress = async () => {
        await handlePress()
    }

    const handlePrevStatusPress = () => {
        DataStore.query(Order, order.id).then(order => DataStore.save(Order.copyOf(order, (updated) => {
            updated.status = "NEW"
        })))
        DataStore.query(Courier, c => c.id.eq(order.courierID))
            .then(courier => DataStore.save(
                    Courier.copyOf(courier, (updated) => {
                        updated.orderID = "null"
                    })
                )
            )

    }

    const handleOverlayPress = () => {
        setToggleModal(false)
    }

    return (
        <>
            {toggleModal === false ? (
                <>
                    <Text style={styles.text3}>
                        wanna try the app without using the owner? enter tester mode.
                    </Text>
                    <Pressable style={styles.redButton} onPress={() => setToggleModal(true)}>
                        <Text style={styles.text2}>Tester?</Text>
                    </Pressable>
                </>

            ) : (
                <Modal visible={toggleModal} animationType="fade" transparent={true}>
                    <TouchableWithoutFeedback onPress={handleOverlayPress}>
                        <View style={styles.overlay}>
                            <Text style={styles.text2}>Current status: {order.status}</Text>

                            <Pressable onPress={handleNextStatusPress} style={{
                                ...styles.nextStatusButton,
                                backgroundColor: isDisabled ? "darkgray" : "#96CEB4"
                            }}
                                       disabled={isDisabled}>
                                <Text style={styles.text}>Click here to proceed into the next status</Text>
                            </Pressable>

                            <Pressable onPress={handlePrevStatusPress} style={{
                                ...styles.nextStatusButton,
                                backgroundColor: "#FFAD60"
                            }}>
                                <Text style={styles.text}>RETURN NEW</Text>
                            </Pressable>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            )}
        </>
    )
}


const styles = StyleSheet.create({
    redButton: {
        backgroundColor: "#D9534F",
        padding: 10,
        margin: 10,
        borderRadius: 5,
    },
    nextStatusButton: {
        padding: 10,
        margin: 10,
        borderRadius: 5,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: "black",
        fontWeight: "bold",
        textAlign: "center",
    },
    text2: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    text3: {
        size: 8,
        color: "black",
        textAlign: "center",
    },
})


export default Tester
