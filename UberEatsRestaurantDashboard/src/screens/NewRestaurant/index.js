import React, {useState} from "react";
import {Button, Card, Form, Input, InputNumber, Switch} from "antd";
// import GooglePlacesAutocomplete, {
//   geocodeByAddress,
//   getLatLng,
// } from "react-google-places-autocomplete";
import {Auth, DataStore} from "aws-amplify";
import '../../coolButton.css';
import {useRestaurantContext} from "../../contexts/RestaurantContext";
import {useAuthContext} from "../../contexts/AuthContext";
import {Restaurant} from "../../models";
import Upload from "antd/es/upload/Upload";

const Settings = () => {
    const {authUser, dbOwner} = useAuthContext()
    const [name, setName] = useState()
    const [image, setImage] = useState()
    const [deliveryFee, setDeliveryFee] = useState()
    const [minDeliveryMinutes, setMinDeliveryMinutes] = useState()
    const [maxDeliveryMinutes, setMaxDeliveryMinutes] = useState()
    const [address, setAddress] = useState(null);
    const [isOpen, setIsAOpen] = useState(true)
    // [coordinates, setCoordinates] = useState(null);
    const {restaurant} = useRestaurantContext()

    const createNewRestaurant = async () => {
        await DataStore.save(
            new Restaurant({
                name: name,
                image: image,
                deliveryFee: deliveryFee,
                minDeliveryMinutes: minDeliveryMinutes,
                maxDeliveryMinutes: maxDeliveryMinutes,
                location: {
                    address: address,
                    lat: parseFloat(lat),
                    lng: parseFloat(lng),
                },
                isOpen: isOpen,
            }))
    }

    // function validateSave() {
    //     return (address && typeof address === "string" && address?.length >= 2)
    // }
    //
    // function validateCoordinates({location}) {
    //     return (location?.lat && location?.lng)
    // }

    // const onSave = async () => {
    //     if (!validateSave()) {
    //         console.error("cannot save! too short address.")
    //         return
    //     }
    //
    //     Geocoder.init(GOOGLE_API_KEY)
    //     Geocoder.from(address + '')
    //         .then(json => {
    //             const location = json?.results?.[0]?.geometry?.location
    //
    //             if (validateCoordinates({location})) {
    //
    //                 if (dbCustomer) {
    //                     updateCustomer({lat: location.lat, lng: location.lng, address: address})
    //                 } else {
    //                     createNewCustomer({lat: location.lat, lng: location.lng, address: address})
    //                 }
    //
    //                 navigation.navigate("Home")
    //             } else {
    //                 console.error("coordinates are not valid!")
    //             }
    //         })
    //         .catch(error => console.warn(error))
    //
    //
    // }

    return (
        <div>
            <Card title="Restaurant Details" style={{margin: 20}}>
                <Form layout="vertical" wrapperCol={{span: 8}}>
                    <Form.Item label="Restaurant name" value={name}  onChange={(e) => setName(e.target.value)} required>
                        <Input placeholder="Enter restaurant name here"/>
                    </Form.Item>
                    <Form.Item label="Restaurant image" value={image} onChange={(e) => setImage(e.target.value)} required>
                        <Upload/>
                    </Form.Item>
                    <Form.Item label="Restaurant delivery Fee" value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value)} required>
                        <Input placeholder="Enter restaurant delivery Fee here"/>
                    </Form.Item>
                    <Form.Item label="Restaurant minimum Delivery Minutes" value={minDeliveryMinutes} onChange={(e) => setMinDeliveryMinutes(e.target.value)} required>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item label="Restaurant maximum Delivery Minutes" value={maxDeliveryMinutes} onChange={(e) => setMaxDeliveryMinutes(e.target.value)} required>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item label="Restaurant address" value={address} onChange={(e) => setAddress(e.target.value)} required>
                        {/*<GooglePlacesAutocomplete*/}
                        {/*  apiKey=""*/}
                        {/*  selectProps={{*/}
                        {/*    value: address,*/}
                        {/*    onChange: getAddressLatLng,*/}
                        {/*  }}*/}
                        {/*/>*/}
                        <Input placeholder="Enter restaurant address here"/>
                    </Form.Item>
                    <Form.Item label="Restaurant is open" required>
                        <Switch onClick={()=>setIsAOpen(toggle=>!toggle)}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={async () => await createNewRestaurant({
                            name,
                            image,
                            minDeliveryMinutes,
                            maxDeliveryMinutes,
                            address,
                            isOpen
                        })}>Submit</Button>
                    </Form.Item>
                </Form>
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
