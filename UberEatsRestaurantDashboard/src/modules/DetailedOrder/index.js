import { Card, Descriptions, Divider, List, Button } from "antd";
import dishes from "../../assets/data/dishes.json";
import { useParams } from "react-router-dom";
import {useEffect, useState} from "react";
import {DataStore} from "aws-amplify";
import {Order, Restaurant} from "../../models";

const DetailedOrder = () => {
  const {id} = useParams();
    const [restaurant, setRestaurant] = useState({})
    const [order, setOrder] = useState({})

    useEffect(() => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ restaurant ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(restaurant,null,4))
        DataStore.query(Restaurant).then(restaurants => setRestaurant(restaurants[0]))
    }, [])

    useEffect(() => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ order ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(order,null,4))
        restaurant &&
        DataStore.query(Order, o => o.and(o => [
            o.restaurantID.eq(restaurant.id),
            o.isDeleted.eq(false),
        ])).then(setOrder[0])
    }, [restaurant])

  return (
    <Card title={`Order ${id}`} style={{ margin: 20 }}>
      <Descriptions bordered column={{ lg: 1, md: 1, sm: 1 }}>
        <Descriptions.Item label="Customer">
          Lukas Grinevicius
        </Descriptions.Item>
        <Descriptions.Item label="Customer Address">
          Address 15-29, City, Country
        </Descriptions.Item>
      </Descriptions>
      <Divider />
      <List
        dataSource={dishes}
        renderItem={(dishItem) => (
          <List.Item>
            <div style={{ fontWeight: "bold" }}>
              {dishItem.name} x{dishItem.quantity}
            </div>
            <div>${dishItem.price}</div>
          </List.Item>
        )}
      />
      <Divider />
      <div style={styles.totalSumContainer}>
        <h2>Total:</h2>
        <h2 style={styles.totalPrice}>$42.96</h2>
      </div>
      <Divider />
      <div style={styles.buttonsContainer}>
        <Button block type="danger" size="large" style={styles.button}>
          Decline Order
        </Button>
        <Button block type="primary" size="large" style={styles.button}>
          Accept Order
        </Button>
      </div>
      <Button block type="primary" size="large">
        Food Is Done
      </Button>
    </Card>
  )
};

const styles = {
  totalSumContainer: {
    flexDirection: "row",
    display: "flex",
  },
  totalPrice: {
    marginLeft: "auto",
    fontWeight: "bold",
  },
  buttonsContainer: {
    display: "flex",
    paddingBottom: 30,
  },
  button: {
    marginRight: 20,
    marginLeft: 20,
  },
};

export default DetailedOrder;
