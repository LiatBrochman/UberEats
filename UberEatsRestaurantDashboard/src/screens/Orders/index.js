import {Card, Table, Tag} from 'antd';
import {useNavigate} from 'react-router-dom';
import {useOrderContext} from "../../contexts/OrderContext";
import {useEffect, useState} from "react";
import {DataStore} from "aws-amplify";
import {Customer} from "../../models";
import "./index.css"
//import MovingComponent from "react-moving-text/src";


const Orders = () => {
    const [activeOrders, setActiveOrders] = useState([])
    const [customer, setCustomer] = useState(null)
    const navigate = useNavigate();
    const {orders, order, setOrder, countOrderUpdates} = useOrderContext()

    useEffect(() => {
        DataStore.query(Customer, order?.customerID).then(setCustomer)
    }, [order])

    useEffect(()=>{
        orders?.length && /** faster check (if orders is an empty array or undefined it will return undefined or 0. and since "0 && (...)" = false , it will not enter the setter */
        setActiveOrders(orders.filter(o=> o.status !== "COMPLETED" && o.status!=="DECLINED"))
    },[countOrderUpdates])

    function getTagByStatus(status) {
        switch (status) {
            case 'ACCEPTED':
                return <Tag color={'#b6e0cd'} style={{fontSize: "10px", color:"#4e8068",  borderRadius:15, fontWeight:"bold",}}>{status}</Tag>

            case 'NEW':
                 return <Tag className="blink_me" color={'#f5c393'} style={{fontSize: "10px", color:"#9c5411", borderRadius:15, fontWeight:"bold"}}>{status}</Tag>
// return <MovingComponent
//     type="flash"
//     duration="1000ms"
//     delay="0s"
//     direction="normal"
//     timing="ease"
//     iteration="5"
//     fillMode="none"
//     style={{fontSize: "10px", color:"#9c5411", borderRadius:15, fontWeight:"bold", backgroundColor:'#f5c393'}}
// >
//     {status}
// </MovingComponent>
            default:
                return <Tag color={'#f0827f'} style={{fontSize: "10px", color:"#730d0a",  borderRadius:15, fontWeight:"bold"}}>{status}</Tag>
        }
    }



    const tableColumns = [
        // {
        //     title: 'Customer',
        //     dataIndex: 'customerName',
        //     key: 'customerName',
        //     // icon: <UserOutlined />,
        //     // render: customer => getCustomer(customer)
        // },
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
            render: (price) => `${price}$`
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: status => getTagByStatus(status)

        }
    ]

    return (
        <Card title={'Orders'} style={{margin: 20}}>
            <Table
                dataSource={activeOrders}
                columns={tableColumns}
                rowKey="id"
                onRow={(orderItem) => ({
                    onClick: () => {
                        setOrder(orderItem)
                        navigate(`order/${orderItem.id}`)

                    },
                })}
            />
        </Card>
    )
}


export default Orders;
