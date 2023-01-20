import React, {useEffect, useState} from "react";
import { Form, Input, Card, Button } from "antd";
// import GooglePlacesAutocomplete, {
//   geocodeByAddress,
//   getLatLng,
// } from "react-google-places-autocomplete";
import {DataStore} from "aws-amplify";
import {Restaurant} from "../../models";

const Settings = () => {
  const [address, setAddress] = useState(null);
  // [coordinates, setCoordinates] = useState(null);
  const [restaurant, setRestaurant] = useState({})

  useEffect(() => {
    DataStore.query(Restaurant).then(restaurants=> setRestaurant(restaurants[0]))
  }, [])

  // const getAddressLatLng = async (address) => {
  //   // setAddress(restaurant.location.address);
  //  const geocodedByAddress = await geocodeByAddress(address.label);
  //  const latLng = await getLatLng(geocodedByAddress[0]);
  //   setCoordinates({lat: restaurant.location.lat, lng: restaurant.location.lng});
  // };

  return (
    <Card title="Restaurant Details" style={{ margin: 20 }}>
      <Form layout="vertical" wrapperCol={{ span: 8 }}>
        <Form.Item label="Restaurant Name" required>
          <Input placeholder="Enter restaurant name here" />
        </Form.Item>
        <Form.Item label="Restaurant Address" required>
          {/*<GooglePlacesAutocomplete*/}
          {/*  apiKey=""*/}
          {/*  selectProps={{*/}
          {/*    value: address,*/}
          {/*    onChange: getAddressLatLng,*/}
          {/*  }}*/}
          {/*/>*/}
        </Form.Item>
        <Form.Item>
          <Button type="primary">Submit</Button>
        </Form.Item>
      </Form>
      <span>{restaurant.location.lat} - {restaurant.location.lng}</span>
    </Card>
  );
};

export default Settings;
