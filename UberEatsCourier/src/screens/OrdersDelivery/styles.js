import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        backgroundColor: 'lightblue',
        flex: 1
    },
    handleIndicator: {
        backgroundColor: 'gray',
        width: 100
    },
    handleIndicatorContainer: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    routeDetailsText: {
        fontSize: 20,
        letterSpacing: 1
    },
    deliveryDetailsContainer: {
        paddingHorizontal: 20
    },
    restaurantName: {
        fontSize: 25,
        letterSpacing: 1,
        paddingVertical: 20
    },
    addressContainer:{
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'center'
    },
    addressText: {
        fontSize: 16,
        color: 'black',
        fontWeight: '500',
        letterSpacing: 0.5,
        marginLeft: 15,
    },
    orderDetailsContainer:{
        borderTopWidth: 1,
        borderColor: 'lightgray',
        paddingTop:20
    },
    orderItemText: {
        fontSize:18, color:'black',
        fontWeight:'500',
        letterSpacing: 0.5,
        marginBottom: 5
    },
    buttonContainer:{
        marginTop:'auto',
        marginVertical: 30,
        marginHorizontal:10,
        borderRadius:10
    },
    buttonText: {
        color:'white',
        paddingVertical: 15,
        fontSize: 20,
        fontWeight: '500',
        textAlign: 'center',
        letterSpacing: 0.5
    }
});
