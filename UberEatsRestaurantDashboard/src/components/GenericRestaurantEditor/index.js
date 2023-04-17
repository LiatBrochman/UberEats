import React, {useEffect, useState} from 'react';
import {Button, Card, Form, Input, InputNumber, Switch, Upload} from "antd";
import {DataStore, Storage} from "aws-amplify";
import {useRestaurantContext} from "../../contexts/RestaurantContext";
import {useAuthContext} from "../../contexts/AuthContext";
import {useNavigate} from "react-router-dom";
import Geocode from "react-geocode";
import {Restaurant} from "../../models";
import './index.css';
import {UploadOutlined} from "@ant-design/icons";
import S3ImagePicker from "../S3ImagePicker";
import {restaurants_assets} from "../../assets/data/restaurants";


function GenericRestaurantEditor({props}) {

    const {restaurant, setRestaurant} = useRestaurantContext()
    const {dbOwner, signOut} = useAuthContext()
    const navigate = useNavigate()
    const imageBaseUrl = "https://uber-eats-bucket142552-dev.s3.amazonaws.com/public/"
    const [image, setImage] = useState(props.type === "NEW" ? '' : restaurant?.image)
    const [fileList, setFileList] = useState([])
    const [form] = Form.useForm()


    useEffect(() => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ image ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(image, null, 4))

    }, [image])

    const customRequest = async ({file, onSuccess, onError}) => {
        try {
            const result = await Storage.put(file.name, file, {
                contentType: file.type,
            })
            setImage(imageBaseUrl + result.key)
            onSuccess(result)
        } catch (error) {
            console.error('Error uploading file:', error)
            onError(error)
        }
    }

    const handleChange = info => {
        setFileList(info.fileList);
    }

    const handleImageSelect = (selectedImage) => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ selectedImage ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(selectedImage, null, 4))

        setImage(imageBaseUrl + selectedImage.key)
        setFileList([
            {
                uid: selectedImage.key,
                name: selectedImage.key,
                status: 'done',
                url: imageBaseUrl + selectedImage.key,
            },
        ])
    }

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
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~on finish image ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(image, null, 4))
        values.image = image;

        try {
            const {
                name,
                image,
                deliveryFee,
                minDeliveryMinutes,
                maxDeliveryMinutes,
                address,
                isOpen = true,
                rating = 3.5
            } = values


            Geocode.setApiKey(process.env.REACT_APP_API_KEY)
            Geocode.fromAddress(address + '')
                .then(async (response) => {
                    if (response?.status === "OK") {

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
                                address: response.results[0]['formatted_address'] || address,
                                lat: parseFloat(lat),
                                lng: parseFloat(lng),
                            },
                            rating: parseFloat(rating)
                        }
                        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ draft_restaurant ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(draft_restaurant, null, 4))

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
                    }
                })

        } catch (e) {
            console.error("error on GenericRestaurantEditor")
            throw new Error(e.message)
        }

        navigate(`/menu`)

    }

    let name = props.type === "NEW" ? '' : restaurant?.name
    // let image = props.type === "NEW" ? '' : restaurant?.image
    let deliveryFee = props.type === "NEW" ? '' : restaurant?.deliveryFee
    let minDeliveryMinutes = props.type === "NEW" ? '' : restaurant?.minDeliveryMinutes
    let maxDeliveryMinutes = props.type === "NEW" ? '' : restaurant?.maxDeliveryMinutes
    let address = props.type === "NEW" ? '' : restaurant?.location.address
    let isOpen = props.type === "NEW" ? true : restaurant?.isOpen

    const renderingImage = <img src={image} alt={imageBaseUrl + '0.png'} style={{maxWidth: '50%', height: 'auto'}}/>

    async function isImgUrl(url) {
        const img = new Image()
        img.src = url
        return await new Promise((resolve) => {
            img.onerror = () => resolve(false)
            img.onload = () => resolve(true)
        })
    }


    return (
        <div>
            <Card title="Restaurant Details" style={{margin: 20}}>
                <Form form={form} layout="vertical" wrapperCol={{span: 8}}
                      onFinish={onFinish}>

                    <Form.Item name="name" label="Restaurant name" initialValue={name} required>
                        <Input className="res-input" placeholder="Enter restaurant name here"/>
                    </Form.Item>

                    <Form.Item label="Restaurant image"
                        name="image"
                        initialValue={image}
                        rules={[
                            {required: true, message: 'Please select an image or enter a URL.'},
                            {type: 'string', min: 1, message: 'Please enter a valid image URL.'},
                            {
                                validator: async (_) =>
                                    await isImgUrl(image)
                                        ? Promise.resolve() :
                                        Promise.reject(new Error('invalid image URL!!'))
                            },
                        ]}>
                        <>
                            {renderingImage}
                            <Input
                                className="res-input"
                                placeholder="Enter image url here"
                                value={image}
                                onChange={(e) => {
                                    setImage(e.target.value)
                                    form.setFieldsValue({image: e.target.value})
                                }}
                            />
                            <Upload
                                accept="image/*"
                                fileList={fileList}
                                customRequest={customRequest}
                                onChange={handleChange}
                                onRemove={() => {
                                    setImage('');
                                    setFileList([]);
                                }}>
                                <button type="button" style={{backgroundColor:"#FFAD60", border: "2px solid #FFAD60", marginBottom:5,  marginTop: 5, borderRadius:10}}>
                                    <UploadOutlined/> Click to Upload
                                </button>
                            </Upload>
                            <S3ImagePicker onSelect={handleImageSelect}/>
                        </>
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
                        <InputNumber className="res-input"/>
                    </Form.Item>

                    <Form.Item name="address" label="Restaurant address" initialValue={address} required>
                        <Input className="res-input" placeholder="Enter restaurant address here"/>
                    </Form.Item>

                    <Form.Item name="isOpen" label="Restaurant is open" valuePropName="checked" initialValue={!!isOpen}
                               required>
                        <Switch defaultChecked={!!isOpen} className="res-switch"
                        />
                    </Form.Item>


                    <Form.Item>
                        <Button className="res-button" type="primary" htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>


                <Button
                    onClick={signOut}
                    style={{
                        textAlign: "center", color: 'gray', backgroundColor: "white"
                        , fontWeight: 500, border: 'none'
                    }}>
                    Sign out
                </Button>

                <Button disabled={process.env.REACT_APP_ENV !== 'local'} onClick={async () => {
                    await DataStore.stop()
                    await DataStore.stop()
                    await DataStore.clear()
                    await DataStore.start()
                }}
                        style={{
                            textAlign: "center", color: 'gray', backgroundColor: "white"
                            , fontWeight: 500, border: 'none'
                        }}
                >
                    clear
                </Button>

                <Button disabled={true} onClick={async () => {
                    restaurants_assets.map(async i => {
                        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ i ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(i, null, 4))
                        props.type = "NEW"
                        await onFinish({...i, address: i.location.address})
                    })

                }}>
                    TEST
                </Button>

            </Card>
        </div>
    )

}

export default GenericRestaurantEditor;
