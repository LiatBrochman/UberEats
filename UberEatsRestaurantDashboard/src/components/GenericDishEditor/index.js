import React, {useState} from 'react';
import {Button, Card, Form, Input, Switch, Upload} from "antd";
import {UploadOutlined} from '@ant-design/icons';
import S3ImagePicker from '../S3ImagePicker';
import {useRestaurantContext} from "../../contexts/RestaurantContext";
import {DataStore, Storage} from "aws-amplify";
import {Dish} from "../../models";
import {useNavigate} from 'react-router-dom';
import './index.css';
import {dishes_assets, dishes_assets_fixed, restaurants_assets} from "../../assets/data/restaurants";


function GenericDishEditor({props}) {

    const {restaurant} = useRestaurantContext()
    const navigate = useNavigate()
    const imageBaseUrl = "https://uber-eats-bucket142552-dev.s3.amazonaws.com/public/"
    const [image, setImage] = useState(props.type === "NEW" ? '' : props.dish.image)
    const [fileList, setFileList] = useState([])
    const [form] = Form.useForm()

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

    let name = props.type === "NEW" ? '' : props.dish.name
    // let image = props.type === "NEW" ? '' : props.dish.image
    let description = props.type === "NEW" ? '' : props.dish.description
    let price = props.type === "NEW" ? '' : props.dish.price
    let isActive = props.type === "NEW" ? true : props.dish.isActive


    const createNewRestaurantDish = async ({name, image, description, price, isActive}) => {

        return await DataStore.save(
            new Dish({
                name: name,
                image: image,
                description: description,
                price: parseFloat(price),
                quantity: 999,
                isActive: isActive,
                isDeleted: false,
                originalID: "null",
                restaurantID: restaurant.id,
                orderID: "null",
                basketID: "null"
            }))
    }

    const editRestaurantDish = async ({name, image, description, price, isActive}) => {

        const existingDish = await DataStore.query(Dish, props.dish.id)

        return await DataStore.save(
            Dish.copyOf(existingDish, updated => {
                updated.name = name
                updated.image = image
                updated.description = description
                updated.price = parseFloat(price)
                updated.isActive = isActive
            })
        )

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

    function getTitle() {
        switch (props.type) {
            case "NEW":
                return "Create New Dish"
            case "EDIT":
                return "Edit Your Dish"
            // return "Edit Your Dish (id :" + props?.dish?.id + ")"
            default :
                return "unknown type"
        }

    }

    const onFinish = async (values) => {

        values.image = image;

        switch (props.type) {

            case "NEW":
                await createNewRestaurantDish(values)
                break;

            case "EDIT":
                await editRestaurantDish(values)
                console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ values ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(values, null, 4))

                break;
            default:
                console.error("wrong type value sent to generic props (can only accept EDIT or NEW)", props.type)
        }
        navigate(`/menu`)


    }

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
        <Card title={getTitle()} style={{margin: 20}}>

            <Form form={form} layout="vertical" wrapperCol={{span: 8}}
                  onFinish={onFinish}
            >

                <Form.Item label="Dish name"
                           name="name"
                           initialValue={name}
                           rules={
                               [{
                                   required: true,
                               },
                                   {
                                       type: 'string',
                                       min: 1,
                                   },
                               ]}>
                    <Input className="dish-input"/>
                </Form.Item>
                <Form.Item label="Dish image"
                           name="image"
                           initialValue={image}
                           rules={[
                               {required: true, message: 'Please select an image or enter a URL.'},
                               {type: 'string', min: 1, message: 'Please enter a valid image URL.'},
                               {
                                   // validator: async (_, value) => {
                                   //     if (await isImgUrl(value)) {
                                   //         setImage(value); // Update the image state
                                   //         return Promise.resolve();
                                   //     } else {
                                   //         return Promise.reject(new Error('Invalid image URL!!'));
                                   //     }
                                   // }
                                   // validator: async(_,value) => await isImgUrl(image) ? value=image : Promise.reject(new Error('invalid image URL!!'))

                                   validator: async(_) => await isImgUrl(image) ? Promise.resolve() : Promise.reject(new Error('invalid image URL!!'))

                                   // {
                                   //     let theTest = await isImgUrl(image)
                                   //     console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ theTest ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(theTest,null,4))
                                   //
                                   //     if(theTest){
                                   //       return Promise.resolve()
                                   //     }
                                   //     return Promise.reject(new Error('invalid image URL!!'))
                                   // }
                               },
                           ]}>
                    <>

                        {renderingImage}

                        <Input
                            className="dish-input"
                            placeholder="Enter image url here"
                            value={image}
                            onChange={(e) => {
                                setImage(e.target.value)
                                form.setFieldsValue({image:e.target.value})
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
                            <button type="button">
                                <UploadOutlined/> Click to Upload
                            </button>
                        </Upload>
                        <S3ImagePicker onSelect={handleImageSelect}/>
                    </>

                </Form.Item>
                <Form.Item label="Dish description"
                           name="description"
                           initialValue={description}
                >
                    <Input className="dish-input"/>
                </Form.Item>
                <Form.Item label="Price ($)"
                           name="price"
                           initialValue={price}
                           rules={
                               [{
                                   required: true,
                               }, {
                                   validator: (_, value) =>
                                       Number(value) > 0
                                           ? Promise.resolve() :
                                           Promise.reject(new Error('price must be greater than 0'))
                               }
                               ]}>
                    <Input className="dish-input"/>
                </Form.Item>
                <Form.Item label="Dish is Active"
                           name="isActive"
                           valuePropName="checked"
                           initialValue={!!isActive}
                           required>
                    <Switch
                        defaultChecked={!!isActive}
                        className="dish-switch"
                    />
                </Form.Item>


                <Button className="dish-button" type="primary" htmlType="submit">
                    Submit
                </Button>

                <Button  disabled={true} onClick={async () => {

                    dishes_assets_fixed.map(async i => {
                        props.type = "NEW"
                        await DataStore.save(
                            new Dish({
                                name: i.name,
                                image: i.image,
                                description: i.description,
                                price: parseFloat(i.price),
                                quantity: 999,
                                isActive: i.isActive,
                                isDeleted: false,
                                originalID: "null",
                                restaurantID: i.restaurantID,
                                orderID: "null",
                                basketID: "null"
                            })).then(res => console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ res ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(res,null,4)))
                            .catch(error=> console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ error ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(error,null,4)))
                    })

                }}>
                    TEST
                </Button>

            </Form>
        </Card>
    )
}

export default GenericDishEditor;
