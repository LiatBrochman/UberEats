import { Card, Table, Tag } from "antd";
import {useEffect, useState} from "react";
import {DataStore} from "aws-amplify";
import {Order, Restaurant} from "../../models";

const OrderHistory = () => {
  const [historyOrders, setHistoryOrders] = useState([])
  const [restaurant, setRestaurant] = useState({})

  useEffect(() => {
    DataStore.query(Restaurant).then(restaurants=> setRestaurant(restaurants[0]))
  }, [])

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
      render:(customerLocation)=>customerLocation.address
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
    <Card title={"History Orders"} style={{ margin: 20 }}>
      <Table
        dataSource={historyOrders}
        columns={tableColumns}
        rowKey="id"
      />
    </Card>
  );
};

export default OrderHistory;
