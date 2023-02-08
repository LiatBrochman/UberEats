import * as Location from "expo-location";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import {useEffect, useState} from "react";
import {useRestaurantContext} from "../../contexts/RestaurantContext";
import {Entypo} from "@expo/vector-icons";
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {useCourierContext} from "../../contexts/CourierContext";
import {Icon} from "@react-native-material/core";
import {useCountdown} from 'react-native-countdown-circle-timer';
import Svg, {Defs, LinearGradient, Path, Stop} from "react-native-svg";
import * as Constants from "constants";


const Map = () => {
    const duration = 60;
    const {path, pathLength, stroke, strokeDashoffset, remainingTime, elapsedTime, size, strokeWidth, onComplete}
        = useCountdown({isPlaying: true, duration: duration || 10000, colors: 'url(#your-unique-id)'})
    const {width, height} = useWindowDimensions()
    const {restaurants, setRestaurant} = useRestaurantContext()
    const [customerLocation, setCustomerLocation] = useState()
    const navigation = useNavigation()

    const {courier} = useCourierContext()
    const onCalloutPress = (restaurant) => {
        setRestaurant(restaurant)
        navigation.navigate("Restaurant")

    }

    useEffect(() => {

        startWatchingCustomerLocation().then(sub => subscription.watchPosition = sub)

        // return subscription?.watchPosition?.remove()
    }, [])


    // useEffect(() => {
    //     if (courier?.length > 0) {
    //         console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ courier ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(courier, null, 4))
    //     }
    // }, [courier])

    const startWatchingCustomerLocation = async () => {

        let {status} = await Location.requestForegroundPermissionsAsync()
        switch (status === "granted") {

            case true:
                return await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        distanceInterval: 100,
                    },
                    ({coords}) => {
                        setCustomerLocation({
                            latitude: coords.latitude,
                            longitude: coords.longitude,
                        })
                    })


            case false:
                console.error('Permission to access location was denied, please try again')
                return await startWatchingCustomerLocation()

        }


    }


    return (
        <>
            {/*<View style={{display:"flex"}}>*/}
            <MapView
                style={{height, width, flex: 3.5}}
                provider={PROVIDER_GOOGLE}
                followUserLocation={true}
                showsUserLocation={true}
                showsMyLocationButton={true}
                showsCompass={true}
                pitchEnabled={true}
                scrollEnabled={true}
                initialRegion={{
                    latitude:
                    // 32.1975652,
                        customerLocation?.latitude || 32.1975652,
                    longitude:
                    // 34.8775085,
                        customerLocation?.longitude || 34.8775085,
                    latitudeDelta: 0.12,
                    longitudeDelta: 0.12
                }}
            >
                {restaurants.length > 0 && restaurants.map(restaurant =>
                    <Marker
                        key={restaurant.id}
                        title={restaurant.name}
                        description={restaurant.location.address}
                        coordinate={{
                            latitude: restaurant.location.lat,
                            longitude: restaurant.location.lng
                        }}
                        onCalloutPress={() => onCalloutPress(restaurant)}
                    >
                        <View style={{
                            backgroundColor: 'white',
                            padding: 5,
                            borderRadius: 20,
                            borderWidth: 2,
                            borderColor: '#FFAD60'
                        }}>
                            <Entypo name="shop" size={24} color="#FFAD60"/>
                        </View>
                    </Marker>
                )}
                {courier &&
                <Marker
                    key={courier.id}
                    title={courier.name}
                    description={courier.transportationMode}
                    coordinate={{
                        latitude: courier.location.lat,
                        longitude: courier.location.lng
                    }}>
                    <View style={{padding: 5, borderRadius: 20}}>
                        {courier?.transportationMode === "DRIVING" &&
                        <View style={{
                            backgroundColor: 'white',
                            padding: 3,
                            borderRadius: 20,
                            borderWidth: 2,
                            borderColor: '#96CEB4'
                        }}>
                            <Icon name="car" size={30} color="#96CEB4"/>
                        </View>}

                        {courier?.transportationMode === "BICYCLING" &&
                        <View style={{
                            backgroundColor: 'white',
                            padding: 3,
                            borderRadius: 20,
                            borderWidth: 2,
                            borderColor: '#96CEB4'
                        }}><Icon name="bicycle" size={30} color="#96CEB4"/></View>}
                    </View>
                </Marker>
                }

            </MapView>

            {/*<View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-evenly'}}>*/}

            {/*<CountdownCircleTimer*/}
            {/*    style={{flex: 1, justifyContent: 'space-evenly',backgroundColor: "rgba(255, 0, 0, 0.3) !important"}}*/}
            {/*    isPlaying*/}
            {/*    duration={7}*/}
            {/*    colors={['#004777', '#F7B801', '#A30000', '#A30000']}*/}
            {/*    color="transparent"*/}
            {/*    bgColor="rgba(255, 0, 0, 0.3)"*/}
            {/*    colorsTime={[7, 5, 2, 0]}*/}
            {/*    onComplete={() => ({ shouldRepeat: true, delay: 1.5 } )}*/}
            {/*>*/}
            {/*    {({remainingTime}) => <Text>{remainingTime}</Text>}*/}
            {/*</CountdownCircleTimer>*/}

            {/*</View>*/}

            {duration && <View style={styles.container}>
                <View style={{width: size, height: size}}>
                    <Svg width={size} height={size}>
                        <Defs>
                            <LinearGradient id="your-unique-id" x1="1" y1="0" x2="0" y2="0">
                                <Stop offset="5%" stopColor="gold"/>
                                <Stop offset="95%" stopColor="red"/>
                            </LinearGradient>
                        </Defs>
                        <Path
                            d={path}
                            fill="none"
                            stroke="#d9d9d9"
                            strokeWidth={strokeWidth}
                        />
                        {elapsedTime !== duration && (
                            <Path
                                d={path}
                                fill="none"
                                stroke={stroke}
                                strokeLinecap="butt"
                                strokeWidth={strokeWidth}
                                strokeDasharray={pathLength}
                                strokeDashoffset={strokeDashoffset}
                            />
                        )}
                    </Svg>
                    <View style={styles.time}>
                        {remainingTime!==0 &&
                        <Text style={{fontSize: 36}}>{Math.floor(remainingTime / 60) + 1}</Text>
                        }
                    </View>
                </View>
            </View>
            }
        </>


    )
}

export default Map

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: 'transparent',
        position: 'absolute',
        padding: 8,
    },
    time: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
    }
});