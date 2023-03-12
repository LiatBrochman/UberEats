import {Card, Table, Tag} from 'antd';
import {useNavigate} from 'react-router-dom';
import {useOrderContext} from "../../contexts/OrderContext";
import "./index.css"


const Orders = () => {
    const navigate = useNavigate()
    const {liveOrders, setOrder, ref } = useOrderContext()


    function getTagByStatus(status) {
        switch (status) {
            case 'ACCEPTED':
                return <Tag color={'#b6e0cd'} style={{
                    fontSize: "10px",
                    color: "#4e8068",
                    borderRadius: 15,
                    fontWeight: "bold",
                }}>{status}</Tag>

            case 'NEW':
                return <Tag className="blink_me" color={'#f5c393'} style={{
                    fontSize: "10px",
                    color: "#9c5411",
                    borderRadius: 15,
                    fontWeight: "bold"
                }}>{status}</Tag>

            default:
                return <Tag color={'#FFEEAD'} style={{
                    fontSize: "10px",
                    color: "#bfa337",
                    borderRadius: 15,
                    fontWeight: "bold"
                }}>{status}</Tag>
        }
    }


    const tableColumns = [
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
                dataSource={liveOrders}
                columns={tableColumns}
                rowKey="id"
                onRow={orderItem => ({
                    onClick: () => {
                        // ref.current.order=orderItem

                        // setOrder({...orderItem})
                        navigate(`order/${orderItem.id}`)

                    },
                })}
            />
        </Card>
    )
}


export default Orders;
