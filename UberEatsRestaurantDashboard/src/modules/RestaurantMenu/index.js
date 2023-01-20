import { Card, Table, Button } from "antd";
import dishes from "../../assets/data/dishes.json";
import { Link } from 'react-router-dom'
import {useEffect, useState} from "react";
import {DataStore} from "aws-amplify";
import {Dish, Restaurant} from "../../models";

const RestaurantMenu = () => {
  const [dishes,setDishes] = useState([])
  const [restaurant, setRestaurant] = useState({})

  useEffect(() => {
    DataStore.query(Restaurant).then(restaurants=> setRestaurant(restaurants[0]))
  }, [])

  useEffect(() => {
    restaurant &&
    DataStore.query(Dish, d =>d.and(d=>[
      d.restaurantID.eq(restaurant.id),
      d.originalID.eq("null"),
      d.isDeleted.eq(false),
    ])).then(setDishes)
  }, [restaurant])


  useEffect(()=>{
    console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ dishes ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(dishes,null,4))
  },[dishes])

  const tableColumns = [
    {
      title: "Menu Item",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price} $`
    },
    {
      title: "Action",
      key: 'action',
      render: () => <Button danger>Remove</Button>
    }
  ];

  const renderNewItemButton = () => (
    <Link to={'create'}>
      <Button type="primary">New Item</Button>
    </Link>
  )

  return (
    <Card title={"Menu"} style={{ margin: 20 }} extra={renderNewItemButton()}>
      <Table dataSource={dishes} columns={tableColumns} rowKey="id" />
    </Card>
  );
};

export default RestaurantMenu;
