import React, {useEffect, useState} from 'react';
import {Button, Card, Form, Input, InputNumber, Switch} from "antd";
import {useRestaurantContext} from "../../contexts/RestaurantContext";
import {DataStore} from "aws-amplify";
import {Dish} from "../../models";
import {validateField} from "../../ui-components/utils";
import Link from "antd/es/typography/Link";

function GenericDishEditor({props}) {

    const {TextArea} = Input
    const {restaurant} = useRestaurantContext()

    const [name, setName] = useState(props.type === "NEW" ? '' : props.dish.name)
    const [image, setImage] = useState(props.type === "NEW" ? '' : props.dish.image)
    const [description, setDescription] = useState(props.type === "NEW" ? '' : props.dish.description)
    const [isActive, setIsActive] = useState(props.type === "NEW" ? '' : props.dish.isActive)
    const [price, setPrice] = useState(props.type === "NEW" ? '' : props.dish.price)


    const createNewRestaurantDish = async ({name, image, description, price, isActive}) => {
        await DataStore.save(
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


        await DataStore.save(
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

    function isValid({name, image, price}) {
        return (
            typeof name === "string" &&
            typeof image === "string" &&
            (typeof price === "string" || typeof price === "number") &&
            name.length > 1 &&
            image.length > 1 &&
            Number(price) > 0
        )
    }

    return (
        <Card title={getTitle()} style={{margin: 20}}>
            <Form layout="vertical" wrapperCol={{span: 8}}>

                <Form.Item label="Dish name" value={name}
                           onChange={(e) => setName(e.target.value)}
                           required>
                    <Input placeholder="Enter dish name" value={name}/>
                </Form.Item>

                <Form.Item label="Dish image" value={image}
                           onChange={(e) => setImage(e.target.value)}
                           required>
                    <Input placeholder="Enter dish image" value={image}/>
                </Form.Item>

                <Form.Item label="Dish description" value={description}
                           onChange={(e) => setDescription(e.target.value)}
                           required>
                    <TextArea rows={4} placeholder="Enter dish description" value={description}/>
                </Form.Item>

                <Form.Item label="Price ($)" value={price}
                           onChange={(e) => setPrice(e.target.value)}
                           required>
                    <InputNumber value={price}/>
                </Form.Item>

                <Form.Item label="dish is active" required >
                    <Switch onClick={() => setIsActive(toggle => !toggle)} checked={isActive}/>
                </Form.Item>

                <Form.Item>
                    <Link to={'/'}>
                        <Button type="primary" onClick={async () => {
                            switch (props.type) {
                                case "NEW":

                                    await createNewRestaurantDish({name, image, description, price, isActive})
                                    break;

                                case "EDIT":
                                    await editRestaurantDish({name, image, description, price, isActive})
                                    break;

                            }
                        }}
                                disabled={!isValid({name, image, price})}

                        >Submit</Button>
                    </Link>

                </Form.Item>

            </Form>
        </Card>
    )
}

export default GenericDishEditor;