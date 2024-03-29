import * as Location from "expo-location";
import {Alert} from "react-native";


const getCoordsByAddress = async (address) => {
    try {
        const result = await Location.geocodeAsync(address)
        if (result?.[0] && result?.[0].latitude) {
            console.log('Valid address:', address)
            return result[0]
        } else {
            Alert.alert('Invalid address:', address)
            return null
        }
    } catch (error) {
        Alert.alert('Error getting coordinates:', error)
        return null
    }
}
const getCurrentPosition = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync()
    if (status !== "granted") {
        console.error('Permission to access location was denied, please try again')
        return await getCurrentPosition()
    }
    return (await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.High})).coords
}
const getAddressByCoords = async ({latitude = null, longitude = null}) => {
    try {
        if (!latitude || !longitude) {
            !longitude && console.error("wrong longitude")
            !latitude && console.error("wrong latitude")
            return null
        }
        const result = await Location.reverseGeocodeAsync({latitude, longitude})
        if (result.length === 0) {
            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ null address ~~~~~~~~~~~~~~~~~~~~~ ")
            return null
        }

        const [{street, streetNumber, city, country,}] = result

        const address = street + ' ' + streetNumber + ', ' + city + ', ' + country
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ address ~~~~~~~~~~~~~~~~~~~~~ :", address)
        return address
    } catch (e) {
        console.error("\n\n ~~~~~~~~~~~~~~~~~~~~~ null address ~~~~~~~~~~~~~~~~~~~~~ ", e)
        return null
    }

}
const startWatchingLocation = async (setState, callback = null) => {

    let {status} = await Location.requestForegroundPermissionsAsync()
    switch (status === "granted") {

        case true:
            return await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 100,
                },
                ({coords}) => {
                    setState({
                        latitude: coords?.latitude,
                        longitude: coords.longitude,
                    })
                    if (callback) {
                        callback(coords)
                    }
                })


        case false:
            console.error('Permission to access location was denied, please try again')
            return await startWatchingLocation()

    }
}
function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}
function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {

    const earthRadiusKm = 6371;

    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
}
function arrived(driverLocation, customerLocation, minDistance_Km) {
    return distanceInKmBetweenEarthCoordinates(driverLocation.latitude, driverLocation.longitude, customerLocation.latitude, customerLocation.longitude) <= minDistance_Km
}
function getETA_array(result) {
    const ETA = result.legs.map(leg => parseInt(leg.duration.text.replace(/\s.*$/, "")))
    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ getETA_array ~~~~~~~~~~~~~~~~~~~~~ :", ETA)
    return ETA
}


export {
    getCoordsByAddress,
    getCurrentPosition,
    getAddressByCoords,
    startWatchingLocation,
    degreesToRadians,
    distanceInKmBetweenEarthCoordinates,
    arrived,
    getETA_array
}