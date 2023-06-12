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
            title: "",
            key: 'edit',
            render: (_,dish) =>
            {
                return <Link to={'edit'} state={dish}>
                    <EditOutlined style={{color: "grey", backgroundColor: 'lightgrey', padding:6, borderRadius:30, fontSize: '11px'}}/>
                </Link>
            }
        },
        {
            title: "",
            key: 'delete',
            dataIndex: 'id',
            render: (id) =>
                <CloseCircleOutlined
                    style={{color: "grey", backgroundColor: 'lightgrey', padding:6, borderRadius:30, fontSize: '11px'}}
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
        <div style={{height:"100vh"}}>
            <Card title={"Menu"} style={{margin: 20, opacity:"90%"}} extra={renderNewItemButton()}>
               {restaurantDishes?.length ? <Table
                    dataSource={restaurantDishes}
                    columns={tableColumns}
                    rowKey="id"/> :  <div style={{height:"10vh", fontSize: "30px", textAlign:"center", fontWeight: "bold"}}> Menu is empty </div>}
            </Card>
        </div>

    )

}

export default RestaurantMenu;
