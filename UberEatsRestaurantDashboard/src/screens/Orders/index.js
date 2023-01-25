import {Card, Table, Tag} from 'antd';
import {useNavigate} from 'react-router-dom';
import {useOrderContext} from "../../contexts/OrderContext";
import {useEffect, useState} from "react";
import {DataStore} from "aws-amplify";
import {Order} from "../../models";

const Orders = () => {
    const [activeOrders, setActiveOrders] = useState([])
    const navigate = useNavigate();
    const {restaurant, orders ,setOrder} = useOrderContext()

    useEffect(() => {
        const lastOrder = orders?.[orders?.length - 1]

        lastOrder?.status !== "COMPLETED" ||  lastOrder?.status !== "DECLINED" &&
        setActiveOrders(prevOrders => [...prevOrders, lastOrder])

    }, [orders])

    useEffect(() => {
        restaurant &&
        DataStore.query(Order, o => o.and(o => [
            o.restaurantID.eq(restaurant.id),
            o.isDeleted.eq(false),
            o.status.ne("DECLINED"),
            o.status.ne("COMPLETED")
        ])).then(setActiveOrders)
    }, [restaurant])


    function getTagByStatus(status) {
        switch (status) {
            case 'ACCEPTED':
                return <Tag color={'green'}>{status}</Tag>

            case 'NEW':
                return <Tag color={'orange'}>{status}</Tag>

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
                dataSource={activeOrders}
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
