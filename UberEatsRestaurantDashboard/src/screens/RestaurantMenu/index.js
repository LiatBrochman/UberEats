import {Button, Card, Table} from "antd";
import {Link} from 'react-router-dom';
import {useRestaurantContext} from "../../contexts/RestaurantContext";
import {DataStore} from "aws-amplify";
import {Dish} from "../../models";


const RestaurantMenu = () => {

    const {restaurantDishes, restaurant} = useRestaurantContext()

    const deleteRestaurantDish = async (id) => {
        await DataStore.query(Dish, id ).then(dish =>
            DataStore.save(
                Dish.copyOf(dish, (updated) => {
                        updated.isDeleted = true
                    }
                )
            )
        )
    }

    const tableColumns = [
        {
            title: "Menu Item",
            dataIndex: "name",
            key: "name",
            render: (name) => name
        },
        {
            title: "Price",
            dataIndex: 'price',
            key: 'price',
            render: (price) => `${price} $`
        },
        {
            title: "Action",
            dataIndex: 'id',
            key: 'Action',
            render: (id) =>
                <Button style={{color: "red", border: "2px solid red"}}
                        onClick={async () => await deleteRestaurantDish(id)}>
                    Remove
                </Button>
            //todo : add remove dish function from db
        },
        {
            title: "Action",
            key: 'action',
            render: () => <Button style={{color:"darkblue", border: "2px solid darkblue"}}>edit</Button>
            //todo: go to edit dish page
        },

    ]

    const renderNewItemButton = () => (
        <Link to={'create'}>
            <Button type="primary">New Item</Button>
        </Link>
    )

    return (
        <>{
            restaurantDishes?.length &&
            <Card title={"Menu"} style={{margin: 20}} extra={renderNewItemButton()}>
                <Table
                    dataSource={restaurantDishes}
                    columns={tableColumns}
                    rowKey="id"/>
            </Card>
        }</>

    )

}

export default RestaurantMenu;
