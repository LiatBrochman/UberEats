import {StyleSheet} from "react-native";

export default StyleSheet.create({
    page: {
        flex: 1,
    },
    iconContainer: {
        position: 'absolute',
        top: 30,
        left: 10,
    },

    image: {
        width: '100%',
        aspectRatio: 5 / 3,
    },
    title: {
        fontSize: 30,
        fontWeight: "600",
        marginVertical: 10,
    },
    menuTitle:{
        marginVertical: 20,
        fontSize: 18,
        letterSpacing: 0.7,
    },
    subtitle: {
        color: '#525252',
        fontSize: 15,

    },
    container: {
        margin: 10,
    },
    button: {
        backgroundColor: "black",
        marginTop: "auto",
        padding: 20,
        alignItems: "center",
        margin: 10,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 20,
    },

})
