import React from 'react';
import {Button, Card, Form, Input, Switch} from "antd";
import {useRestaurantContext} from "../../contexts/RestaurantContext";
import {DataStore} from "aws-amplify";
import {Dish} from "../../models";
import {useNavigate} from 'react-router-dom';

function GenericDishEditor({props}) {

    const {restaurant} = useRestaurantContext()
    const navigate = useNavigate()


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

    function getTitle() {
        switch (props.type) {
            case "NEW":
                return "Create New Dish"
            case "EDIT":
                return "Edit Your Dish (id :" + props?.dish?.id + ")"
            default :
                return "unknown type"
        }
    }


    const onFinish = async (values) => {
        switch (props.type) {

            case "NEW":
                await createNewRestaurantDish(values)
                break;

            case "EDIT":
                await editRestaurantDish(values)
                break;
        }
        navigate(`/menu`)
    }


    let name = props.type === "NEW" ? '' : props.dish.name
    let image = props.type === "NEW" ? '' : props.dish.image
    let description = props.type === "NEW" ? '' : props.dish.description
    let price = props.type === "NEW" ? '' : props.dish.price
    let isActive = props.type === "NEW" ? true : props.dish.isActive


    return (
        <Card title={getTitle()} style={{margin: 20}}>
            <Form layout="vertical" wrapperCol={{span: 8}}
                  onFinish={onFinish}>

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
                    <Input/>
                </Form.Item>
                <Form.Item label="Dish image"
                           name="image"
                           initialValue={image}
                           rules={
                               [{
                                   required: true,
                               },
                                   {
                                       type: 'string',
                                       min: 1,
                                   },
                               ]}>
                    <Input/>
                </Form.Item>
                <Form.Item label="Dish description"
                           name="description"
                           initialValue={description}
                >
                    <Input/>
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
                    <Input/>
                </Form.Item>
                <Form.Item label="Dish is Active"
                           name="isActive"
                           initialValue={isActive}
                           required>
                    <Switch
                        defaultChecked={!!isActive}
                    />
                </Form.Item>


                <Button type="primary" htmlType="submit">
                    Submit
                </Button>

            </Form>
        </Card>
    )
}

export default GenericDishEditor;