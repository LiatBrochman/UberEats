import * as Location from "expo-location";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import {useEffect, useState} from "react";
import {useRestaurantContext} from "../../contexts/RestaurantContext";
import {Entypo} from "@expo/vector-icons";
import {useWindowDimensions, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {useCourierContext} from "../../contexts/CourierContext";
import {Icon} from "@react-native-material/core";


const Map = () => {

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

    return (customerLocation && customerLocation?.latitude &&
        <MapView
            style={{height, width}}
            provider={PROVIDER_GOOGLE}
            followUserLocation={true}
            showsUserLocation={true}
            showsMyLocationButton={true}
            showsCompass={true}
            pitchEnabled={true}
            scrollEnabled={true}
            initialRegion={{
                latitude: customerLocation.latitude,
                longitude: customerLocation.longitude,
                latitudeDelta: 0.12,
                longitudeDelta: 0.12
            }}
        >
            {restaurants && restaurants?.length > 0 && restaurants.map(restaurant =>
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
                    <View style={{backgroundColor: 'green', padding: 5, borderRadius: 20}}>
                        <Entypo name="shop" size={24} color="white"/>
                    </View>
                </Marker>
            )}
            {courier && courier?.location &&
            <Marker
                key={courier.id}
                title={courier.name}
                description={courier.transportationMode}
                coordinate={{
                    latitude: courier.location.lat,
                    longitude: courier.location.lng
                }}>
                <View style={{padding: 5, borderRadius: 20}}>
                    {courier?.transportationMode === "DRIVING" && <Icon name="car" size={30} color="black"/>}
                    {courier?.transportationMode === "BICYCLING" && <Icon name="bicycle" size={30} color="black"/>}
                </View>
            </Marker>
            }

        </MapView>
    )
}

export default Map