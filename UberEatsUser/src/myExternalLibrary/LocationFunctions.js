import * as Location from "expo-location";

const getCoordsByAddress = async (address) => {
    const result = await Location.geocodeAsync(address);
    if (result?.[0] && result?.[0].latitude) {
        return result[0]// contains longitude and latitude
    } else {
        console.error("couldn't get coordinates from:", address)
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
    if (!latitude || !longitude) {
        !longitude && console.error("wrong longitude")
        !latitude && console.error("wrong latitude")
        return null
    }
    const [{street, streetNumber, city, country,}] = await Location.reverseGeocodeAsync({latitude, longitude})
    const address = street + ' ' + streetNumber + ', ' + city + ', ' + country
    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ address ~~~~~~~~~~~~~~~~~~~~~ :", address)
    return address
}



export {getCoordsByAddress,getCurrentPosition,getAddressByCoords,}