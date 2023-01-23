import React, {useState} from "react";
import {Button, Card, Form, Input} from "antd";
// import GooglePlacesAutocomplete, {
//   geocodeByAddress,
//   getLatLng,
// } from "react-google-places-autocomplete";
import {Auth, DataStore} from "aws-amplify";
import '../../coolButton.css';
import {useRestaurantContext} from "../../contexts/RestaurantContext";
import {useAuthContext} from "../../contexts/AuthContext";

const Settings = () => {
    const {authUser, dbOwner} = useAuthContext()
    const [address, setAddress] = useState(null);
    // [coordinates, setCoordinates] = useState(null);
    const {restaurant} = useRestaurantContext()
    return (
        <div>
            <Card title="Restaurant Details" style={{margin: 20}}>
                <Form layout="vertical" wrapperCol={{span: 8}}>
                    <Form.Item label="Restaurant Name" required>
                        <Input placeholder="Enter restaurant name here"/>
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
                <span>{restaurant?.location?.lat} - {restaurant?.location?.lng}</span>
            </Card>

            <Button
                onClick={() => Auth.signOut()}
                style={{textAlign: "center", color: 'red', margin: 10}}>
                Sign out
            </Button>

            <Button onClick={async () => {
                await DataStore.stop()
                await DataStore.clear()
                await DataStore.start()
            }}>
                clear
            </Button>
        </div>
    )
}

export default Settings;
