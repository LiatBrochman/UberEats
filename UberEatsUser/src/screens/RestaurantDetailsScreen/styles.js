import {StyleSheet} from "react-native";

export default StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: "white"
    },
    iconContainer: {
        position: "absolute",
        top: 40,
        left: 10,
    },

    image: {
        width: "100%",
        aspectRatio: 5 / 3,
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,

    },
    title: {
        fontSize: 35,
        fontWeight: "600",
        marginVertical: 10,
        backgroundColor: "white",
        marginTop: -70,
        marginLeft: 10,
        marginRight: 20,
        textAlign: "center",
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    menuTitle: {
        marginTop: 20,
        marginLeft: 10,
        fontSize: 18,
        letterSpacing: 0.7,
    },
    subtitle: {
        fontSize: 15,
        color: "#D9534F",
        textAlign: "center",
        fontWeight: "600",
    },
    container: {
        marginTop: 10,
        marginLeft: 10,
        backgroundColor: "white"

    },
    button: {
        backgroundColor: "#96CEB4",
        marginTop: "auto",
        padding: 20,
        alignItems: "center",
        margin: 10,
        borderRadius: 20,
    },
    buttonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 18,
    },

});
