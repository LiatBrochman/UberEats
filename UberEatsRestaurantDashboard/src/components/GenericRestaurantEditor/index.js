import React from 'react';
import {Button, Card, Form, Input, InputNumber, Switch} from "antd";
import {Auth, DataStore} from "aws-amplify";
import {useRestaurantContext} from "../../contexts/RestaurantContext";
import {useAuthContext} from "../../contexts/AuthContext";
import {useNavigate} from "react-router-dom";
import Geocode from "react-geocode";
import {Restaurant} from "../../models";
import  './index.css';


function GenericRestaurantEditor({props}) {

    const {restaurant, setRestaurant} = useRestaurantContext()
    const {dbOwner} = useAuthContext()
    const navigate = useNavigate()

    const createNewRestaurant = async (draft_restaurant) => {
        try {
            DataStore.save(new Restaurant(draft_restaurant))
                .then(setRestaurant)
        } catch (e) {
            console.error("error on create new restaurant")
            throw new Error(e.message)
        }
    }

    const editRestaurant = async (draft_restaurant) => {
        try {
            DataStore.query(Restaurant, restaurant.id)
                .then(origin => DataStore.save(Restaurant.copyOf(origin, updated => Object.assign(updated, draft_restaurant))))
                .then(setRestaurant)
        } catch (e) {
            console.error("error on edit restaurant")
            throw new Error(e.message)
        }
    }

    const onFinish = async (values) => {

        try {

            const {
                name,
                image,
                deliveryFee,
                minDeliveryMinutes,
                maxDeliveryMinutes,
                address,
                isOpen,
            } = values


            Geocode.setApiKey(process.env.REACT_APP_API_KEY)
            Geocode.fromAddress(address + '')
                .then(async response => {
                    const {lat, lng} = response.results[0].geometry.location;
                    const draft_restaurant = {
                        name: name,
                        image: image,
                        deliveryFee: parseFloat(deliveryFee),
                        minDeliveryMinutes: parseInt(minDeliveryMinutes),
                        maxDeliveryMinutes: parseInt(maxDeliveryMinutes),
                        isOpen: isOpen,
                        isDeleted: false,
                        ownerID: dbOwner.id,
                        location: {
                            address: address,
                            lat: parseFloat(lat),
                            lng: parseFloat(lng),
                        }
                    }

                    switch (props.type) {

                        case "NEW":
                            await createNewRestaurant(draft_restaurant)
                            break;

                        case "EDIT":
                            await editRestaurant(draft_restaurant)
                            break;

                        default:
                            console.log("wrong idea..")
                    }
                })

        } catch (e) {
            console.error("error on GenericRestaurantEditor")
            throw new Error(e.message)
        }

        navigate(`/menu`)

    }

    let name = props.type === "NEW" ? '' : restaurant?.name
    let image = props.type === "NEW" ? '' : restaurant?.image
    let deliveryFee = props.type === "NEW" ? '' : restaurant?.deliveryFee
    let minDeliveryMinutes = props.type === "NEW" ? '' : restaurant?.minDeliveryMinutes
    let maxDeliveryMinutes = props.type === "NEW" ? '' : restaurant?.maxDeliveryMinutes
    let address = props.type === "NEW" ? '' : restaurant?.location.address
    let isOpen = props.type === "NEW" ? true : restaurant?.isOpen

    return (
        <div>
            <Card title="Restaurant Details" style={{margin: 20}}>
                <Form layout="vertical" wrapperCol={{span: 8}}
                      onFinish={onFinish}>

                    <Form.Item name="name" label="Restaurant name" initialValue={name} required>
                        <Input className="res-input" placeholder="Enter restaurant name here"/>
                    </Form.Item>

                    <Form.Item name="image" label="Restaurant image" initialValue={image} required>
                        <Input className="res-input" placeholder="Enter image url here"/>
                    </Form.Item>

                    <Form.Item name="deliveryFee" label="Restaurant delivery Fee" initialValue={deliveryFee}
                               rules={
                                   [{required: true,}, {
                                       validator: (_, value) =>
                                           Number(value) > 0
                                               ? Promise.resolve() :
                                               Promise.reject(new Error('deliveryFee must be greater than 0'))
                                   }]
                               } required>
                        <Input className="res-input" placeholder="Enter restaurant delivery Fee here"/>
                    </Form.Item>

                    <Form.Item name="minDeliveryMinutes" label="Restaurant minimum Delivery Minutes"
                               initialValue={minDeliveryMinutes}
                               rules={
                                   [{required: true,}, {
                                       validator: (_, value) =>
                                           Number(value) >= 30
                                               ? Promise.resolve() :
                                               Promise.reject(new Error('minDeliveryMinutes must be greater than 30'))
                                   }]
                               } required
                    >
                        <InputNumber className="res-input"/>
                    </Form.Item>

                    <Form.Item name="maxDeliveryMinutes" label="Restaurant maximum Delivery Minutes"
                               initialValue={maxDeliveryMinutes}
                               rules={
                                   [{required: true}, {
                                       validator: (_, value) =>
                                           Number(value) >= 30
                                               ? Promise.resolve() :
                                               Promise.reject(new Error('maxDeliveryMinutes must be greater than 30'))

                                   }]

                               } required>
                        <InputNumber className="res-input" />
                    </Form.Item>

                    <Form.Item name="address" label="Restaurant address" initialValue={address} required>
                        <Input className="res-input" placeholder="Enter restaurant address here"/>
                    </Form.Item>

                    <Form.Item name="isOpen" label="Restaurant is open" valuePropName="checked" required>
                        <Switch defaultChecked={!!isOpen} className="res-switch"
                        />
                    </Form.Item>


                    <Form.Item>
                        <Button className="res-button" type="primary" htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>


            <Button
                onClick={() => Auth.signOut()}
                style={{textAlign: "center", color: 'gray', backgroundColor: "white"
                  ,fontWeight:500, border: 'none'}}>
                Sign out
            </Button>

            <Button onClick={async () => {
                await DataStore.stop()
                await DataStore.stop()
                await DataStore.clear()
                await DataStore.start()
            }}
                    style={{textAlign: "center", color: 'gray',backgroundColor: "white"
                        ,fontWeight:500, border: 'none'}}
            >
                clear
            </Button>
            </Card>
        </div>
    )

}

export default GenericRestaurantEditor;
