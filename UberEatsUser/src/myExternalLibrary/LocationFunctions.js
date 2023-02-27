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
        console.error("\n\n ~~~~~~~~~~~~~~~~~~~~~ null address ~~~~~~~~~~~~~~~~~~~~~ ",e)
        return null
    }

}


export {getCoordsByAddress, getCurrentPosition, getAddressByCoords,}