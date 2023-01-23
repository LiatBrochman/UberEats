import {Card, Table, Tag} from 'antd';
import {useNavigate} from 'react-router-dom';
import {useOrderContext} from "../../contexts/OrderContext";

const Orders = () => {
    // const [orders, setOrders] = useState([])
    // const [restaurant, setRestaurant] = useState({})
    const navigate = useNavigate();
    const {restaurant, orders ,setOrder} = useOrderContext()


    // useEffect(() => {
    //     console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ restaurant ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(restaurant, null, 4))
    //     DataStore.query(Restaurant).then(restaurants => setRestaurant(restaurants[1]))
    // }, [])
    //
    // useEffect(() => {
    //     console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ orders ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(orders, null, 4))
    //     restaurant &&
    //     DataStore.query(Order, o => o.and(o => [
    //         o.restaurantID.eq(restaurant.id),
    //         o.isDeleted.eq(false),
    //         o.status.ne("DECLINED"),
    //         o.status.ne("COMPLETED")
    //     ])).then(setOrders)
    // }, [restaurant])


    function getTagByStatus(status) {
        switch (status) {
            case 'ACCEPTED':
                return <Tag color={'green'}>{status}</Tag>

            case 'NEW':
                return <Tag color={'orange'}>{status}</Tag>

            case 'DECLINED':
                return <Tag color={'red'}>{status}</Tag>

            default:
                return <Tag color={'blue'}>{status}</Tag>
        }
    }

    const tableColumns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Delivery Address',
            dataIndex: 'customerLocation',
            key: 'customerLocation',
            render: customerLocation => customerLocation.address
        },
        {
            title: 'Price',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (price) => `${price} $`
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: status => getTagByStatus(status)

        }
    ]

    return (orders &&
        <Card title={'Orders'} style={{margin: 20}}>
            <Table
                dataSource={orders}
                columns={tableColumns}
                rowKey="id"
                onRow={(orderItem) => ({
                    onClick: () => {
                        setOrder(orderItem)
                        navigate(`order/${orderItem.id}`)
                    }
                })}
            />
        </Card>
    )
}


export default Orders;
