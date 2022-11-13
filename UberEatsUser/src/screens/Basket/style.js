import {StyleSheet} from "react-native";
import BasketDishItem from "./BasketDishItem";

export default StyleSheet.create({
    page: {
        flex: 1,
        width: '100%',
        paddingVertical: 40,
        padding: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: "600",
        marginVertical: 10,
    },
    separator: {
        height: 1,
        backgroundColor: "lightgray",
        marginVertical: 10,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 15,
    },
    quantity: {
        fontSize: 25,
        marginHorizontal: 20,
    },
    button: {
        backgroundColor: "black",
        marginTop: "auto",
        padding: 20,
        alignItems: "center"
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 20,
    },
    quantityContainer: {
        backgroundColor: 'lightgray',
        paddingHorizontal: 5,
        marginVertical: 2,
        marginRight: 10,
        borderRadius: 3,
    },
    title: {
        fontWeight: "bold",
        marginTop: 20,
        fontSize: 19
    },
    basketDishName: {
        fontWeight: '600'
    },
    basketDishPrice: {
        marginLeft: "auto"
    },
})
