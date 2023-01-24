import {Card, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import {useOrderContext} from "../../contexts/OrderContext";
import {DataStore} from "aws-amplify";
import {Order} from "../../models";

const OrderHistory = () => {
    const [historyOrders, setHistoryOrders] = useState([])
    const {restaurant, orders} = useOrderContext()

    useEffect(() => {
        const lastOrder = orders?.[orders?.length - 1]

        lastOrder?.status === "COMPLETED" ||  lastOrder?.status === "DECLINED" &&
        setHistoryOrders(prevOrders => [...prevOrders, lastOrder])

    }, [orders])


    useEffect(() => {
      restaurant &&
      DataStore.query(Order, o =>o.and(o=>[
        o.restaurantID.eq(restaurant.id),
        o.isDeleted.eq(false),
          o.or(o => [
              o.status.eq("DECLINED"),
              o.status.eq("COMPLETED")
          ])
      ])).then(setHistoryOrders)
    }, [restaurant])

    const tableColumns = [
        {
            title: "Order ID",
            dataIndex: "id",
            key: "id",
        },
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
            render: (price) => `${price} $`,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === "COMPLETED" ? "green" : status === "DECLINED" ? "red" : "black"}>{status}</Tag>
            ),
        },
    ];

    return (
        <Card title={"History Orders"} style={{margin: 20}}>
            <Table
                dataSource={historyOrders}
                columns={tableColumns}
                rowKey="id"
            />
        </Card>
    );
};

export default OrderHistory;
