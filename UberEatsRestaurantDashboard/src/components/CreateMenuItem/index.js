import {Button, Card, Form, Input, InputNumber, Switch} from "antd";
import {Dish} from "../../models";
import {DataStore} from "aws-amplify";
import {Alert} from "@aws-amplify/ui-react";
import {useState} from "react";
import {useRestaurantContext} from "../../contexts/RestaurantContext";

const {TextArea} = Input;

const CreateMenuItem = () => {
    // const na
    const {restaurant} = useRestaurantContext()
    const [name, setName] = useState('')
    const [image, setImage] = useState('')
    const [description, setDescription] = useState('')
    const [isActive, setIsActive] = useState(false)
    const [price, setPrice] = useState()

    const createNewRestaurantDish = async () => {
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


    return (
        <Card title="New Menu Item" style={{margin: 20}}>
            <Form layout="vertical" wrapperCol={{span: 8}}>
                <Form.Item label="Dish name" value={name}
                           onChange={(e) => setName(e.target.value)}
                           required>
                    <Input placeholder="Enter dish name"/>
                </Form.Item>
                <Form.Item label="Dish image" value={image}
                           onChange={(e) => setImage(e.target.value)}
                           required>
                    <Input placeholder="Enter dish image"/>
                </Form.Item>
                <Form.Item label="Dish description" value={description}
                           onChange={(e) => setDescription(e.target.value)}
                           required>
                    <TextArea rows={4} placeholder="Enter dish description"/>
                </Form.Item>
                <Form.Item label="Price ($)" value={price}
                           onChange={(e) => setPrice(e.target.value)}
                           required>
                    <InputNumber/>
                </Form.Item>
                <Form.Item label="dish is active" required>
                    <Switch onClick={()=>setIsActive(toggle=>!toggle)}/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={async () => await createNewRestaurantDish({
                        name,
                        image,
                        description,
                        price,
                        isActive
                    })}>Submit</Button>
                </Form.Item>
            </Form>
        </Card>
    )
};

export default CreateMenuItem;
