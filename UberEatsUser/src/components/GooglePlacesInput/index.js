import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {View} from "react-native";
import * as Location from "expo-location";

// const homePlace = {
//     description: 'Home',
//     geometry: { location: { lat: 48.8152937, lng: 2.4597668 } },
// };
// const workPlace = {
//     description: 'Work',
//     geometry: { location: { lat: 48.8496818, lng: 2.2940881 } },
// };

const GooglePlacesInput = () => {
    Location.installWebGeolocationPolyfill();
    return (
        <View style={{flex: 1}}>
        <GooglePlacesAutocomplete
            placeholder='Search'
            onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                console.log(data, details);
            }}
            query={{
                key: 'AIzaSyB7AZZ2DkSHaHEKCxDG5A4r_vZ5kqwzXrw',
                language: 'en',
            }}
            // listViewDisplayed="auto"
            // predefinedPlaces={[homePlace, workPlace]}

        />
        </View>

    );
};

export default GooglePlacesInput;
