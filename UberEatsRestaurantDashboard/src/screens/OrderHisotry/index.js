import {Card, Table, Tag} from "antd";
import {useOrderContext} from "../../contexts/OrderContext";

const OrderHistory = () => {
    const {completedOrders} = useOrderContext({completedOrders:[]})


    const tableColumns = [
        // {
        //     title: "Order ID",
        //     dataIndex: "id",
        //     key: "id",
        // },
        {
            title: "Delivery Address",
            dataIndex: "customerLocation",
            key: "customerLocation",
            render: (customerLocation) => customerLocation.address
        },
        {
            title: "Price",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (price) => `${price}$`,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === "COMPLETED" ? "#b6e0cd" : status === "DECLINED" ? "#f0827f" : "black"}
                style={{color: status === "COMPLETED" ? "#4e8068" : status === "DECLINED" ? "#730d0a": "black",  borderRadius:15, fontWeight:"bold"}}
                >{status}</Tag>
            ),
        },
    ];

    return (
        <Card title={"History Orders"} style={{margin: 20}}>
            <Table
                dataSource={completedOrders}
                columns={tableColumns}
                rowKey="id"
            />
        </Card>
    );
};

export default OrderHistory;
