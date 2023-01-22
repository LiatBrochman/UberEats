import React, {useEffect, useState} from "react";
import {Form, Input, Card, Button} from "antd";
// import GooglePlacesAutocomplete, {
//   geocodeByAddress,
//   getLatLng,
// } from "react-google-places-autocomplete";
import {Amplify, Auth, DataStore} from "aws-amplify";
import {Restaurant} from "../../models";
import '../../coolButton.css';

const Settings = () => {
    const [address, setAddress] = useState(null);
    // [coordinates, setCoordinates] = useState(null);
    const [restaurant, setRestaurant] = useState({})

    useEffect(() => {
        DataStore.query(Restaurant).then(restaurants => setRestaurant(restaurants[0]))
    }, [])

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
                onClick={() => {
                    Auth.signOut().then(() => Amplify.DataStore.clear().then(() => Amplify.DataStore.start()))
                }}
                style={{textAlign: "center", color: 'red', margin: 10}}>
                Sign out
            </Button>


            <button className="animated-button1"
                    onClick={async () => await Amplify.DataStore.clear().then(async () => await Amplify.DataStore.start())}
            >
                <span>Amplify
                <span>clear</span>
                </span>
                <span> <span>  </span> </span>
                Amplify.DataStore.clear()
                <span> <span>  </span> </span>
                <span>ready?</span>


            </button>

        </div>
    )
}

export default Settings;
