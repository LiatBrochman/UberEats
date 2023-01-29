import {Card, Table, Tag} from 'antd';
import {useNavigate} from 'react-router-dom';
import {useOrderContext} from "../../contexts/OrderContext";
import {useEffect, useState} from "react";


const Orders = () => {
    const [activeOrders, setActiveOrders] = useState([])
    const navigate = useNavigate();
    const {orders, setOrder,countOrderUpdates} = useOrderContext()

    useEffect(()=>{
        orders?.length && /** faster check (if orders is an empty array or undefined it will return undefined or 0. and since "0 && (...)" = false , it will not enter the setter */
        setActiveOrders(orders.filter(o=> o.status !== "COMPLETED" && o.status!=="DECLINED"))
    },[countOrderUpdates])

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
            render: customerLocation => customerLocation?.address
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

    return (orders?.length &&
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
