import {Button, Card, Table} from "antd";
import {Link} from 'react-router-dom';
import {useRestaurantContext} from "../../contexts/RestaurantContext";
import {DataStore} from "aws-amplify";
import {Dish} from "../../models";
import {CloseCircleOutlined,  EditOutlined} from "@ant-design/icons";
import "./index.css"


const RestaurantMenu = () => {

    const {restaurantDishes} = useRestaurantContext()
    const deleteRestaurantDish = async (id) => {
        await DataStore.query(Dish,id).then(dish =>
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
            title: "Dish",
            dataIndex: "name",
            key: "name",
            render: (name) => name
        },
        {
            title: "Price",
            dataIndex: 'price',
            key: 'price',
            render: (price) => `${price}$`
        },
        {
            title: "Edit",
            key: 'edit',
            render: (_,dish) =>
            {
                return <Link to={'edit'} state={dish}>
                    <EditOutlined style={{color: "grey", backgroundColor: 'lightgray', padding:8, borderRadius:30, fontSize: '15px'}}/>
                </Link>
            }
        },
        {
            title: "Delete",
            key: 'delete',
            dataIndex: 'id',
            render: (id) =>
                <CloseCircleOutlined
                    style={{color: "grey", backgroundColor: 'lightgray', padding:8, borderRadius:30, fontSize: '15px'}}
                    onClick={async () => await deleteRestaurantDish(id)}
                />
        },


    ]

    const renderNewItemButton = () => (
        <Link to={'create'}>
            <Button className="menu-button" type="primary">New Item</Button>
        </Link>
    )

    return (
        <>
            <Card title={"Menu"} style={{margin: 20}} extra={renderNewItemButton()}>
               {restaurantDishes?.length && <Table
                    dataSource={restaurantDishes}
                    columns={tableColumns}
                    rowKey="id"/>}
            </Card>
        </>

    )

}

export default RestaurantMenu;
