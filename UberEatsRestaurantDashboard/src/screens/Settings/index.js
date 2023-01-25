// import React, {useState} from "react";
// import {Button, Card, Form, Input, InputNumber} from "antd";
// // import GooglePlacesAutocomplete, {
// //   geocodeByAddress,
// //   getLatLng,
// // } from "react-google-places-autocomplete";
// import {Auth, DataStore} from "aws-amplify";
// import '../../coolButton.css';
// import {useRestaurantContext} from "../../contexts/RestaurantContext";
// import {useAuthContext} from "../../contexts/AuthContext";
// import {useNavigate} from "react-router-dom";
// import Geocode from "react-geocode";
//
// const Settings = () => {
//     const {authUser, dbOwner} = useAuthContext()
//     const [name, setName] = useState('')
//     const [image, setImage] = useState('')
//     const [minDeliveryMinutes, setMinDeliveryMinutes] = useState('')
//     const [maxDeliveryMinutes, setMaxDeliveryMinutes] = useState('')
//     const [address, setAddress] = useState('');
//     const [deliveryFee, setDeliveryFee] = useState('')
//     const {restaurant} = useRestaurantContext()
//     const navigate = useNavigate()
//
//     // const updateRestaurant = ({lat, lng, address}) => {
//     //     DataStore.query(Restaurant, restaurant.id).then(restaurant =>
//     //         DataStore.save(
//     //             Restaurant.copyOf(restaurant, (updated) => {
//     //                 updated.name = name
//     //                 updated.image = image
//     //                 updated.minDeliveryMinutes = minDeliveryMinutes
//     //                 updated.minDeliveryMinutes= minDeliveryMinutes
//     //                 updated.location = {
//     //                     address: address,
//     //                     lat: parseFloat(lat),
//     //                     lng: parseFloat(lng),
//     //                 }
//     //             })
//     //         ).then()
//     //     )
//     //
//     // }
//
//     // function validateSave() {
//     //     return (address && typeof address === "string" && address?.length >= 2)
//     // }
//     //
//     // function validateCoordinates({location}) {
//     //     return (location?.lat && location?.lng)
//     // }
//
//     // const onSave = async () => {
//     //     if (!validateSave()) {
//     //         console.error("cannot save! too short address.")
//     //         return
//     //     }
//     //
//     //     Geocoder.init(GOOGLE_API_KEY)
//     //     Geocoder.from(address + '')
//     //         .then(json => {
//     //             const location = json?.results?.[0]?.geometry?.location
//     //
//     //             if (validateCoordinates({location})) {
//     //
//     //                 if (dbCustomer) {
//     //                     updateCustomer({lat: location.lat, lng: location.lng, address: address})
//     //                 } else {
//     //                     createNewCustomer({lat: location.lat, lng: location.lng, address: address})
//     //                 }
//     //
//     //                 navigation.navigate("Home")
//     //             } else {
//     //                 console.error("coordinates are not valid!")
//     //             }
//     //         })
//     //         .catch(error => console.warn(error))
//     //
//     //
//     // }
//
//     return (
//         <div>
//             <Card title="Restaurant Details" style={{margin: 20}}>
//                 <Form layout="vertical" wrapperCol={{span: 8}}>
//                     <Form.Item label="Restaurant name" value={name} onChange={setName} required>
//                         <Input placeholder="Enter restaurant name here" value={name}/>
//                     </Form.Item>
//                     <Form.Item label="Restaurant image" value={image} onChange={setImage} required>
//                         <Input placeholder="Enter restaurant image name here"/>
//                     </Form.Item>
//                     <Form.Item label="Restaurant delivery Fee" value={deliveryFee}
//                                onChange={(e) => setDeliveryFee(e.target.value)} required>
//                         <Input placeholder="Enter restaurant delivery Fee here"/>
//                     </Form.Item>
//                     <Form.Item label="Restaurant minimum Delivery Minutes" value={minDeliveryMinutes} onChange={setMinDeliveryMinutes} required>
//                         <InputNumber />
//                     </Form.Item>
//                     <Form.Item label="Restaurant maximum Delivery Minutes" value={maxDeliveryMinutes} onChange={setMaxDeliveryMinutes} required>
//                         <InputNumber />
//                     </Form.Item>
//                     <Form.Item label="Restaurant address" value={address} onChange={setAddress} required>
//                         {/*<GooglePlacesAutocomplete*/}
//                         {/*  apiKey=""*/}
//                         {/*  selectProps={{*/}
//                         {/*    value: address,*/}
//                         {/*    onChange: getAddressLatLng,*/}
//                         {/*  }}*/}
//                         {/*/>*/}
//                         <Input placeholder="Enter restaurant address here"/>
//                     </Form.Item>
//                     <Form.Item>
//                         <Button type="primary">Submit</Button>
//                     </Form.Item>
//                 </Form>
//                 <span>{restaurant?.location?.lat} - {restaurant?.location?.lng}</span>
//             </Card>
//
//             <Button
//                 onClick={() => {
//                     Auth.signOut()
//                    navigate("/")
//                 }}
//                 style={{textAlign: "center", color: 'red', margin: 10}}>
//                 Sign out
//             </Button>
//
//             <Button onClick={async () => {
//                 await DataStore.stop()
//                 await DataStore.clear()
//                 await DataStore.start()
//             }}>
//                 clear
//             </Button>
//         </div>
//     )
// }
//
// export default Settings;
