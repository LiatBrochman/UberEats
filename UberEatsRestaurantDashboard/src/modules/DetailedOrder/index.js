import {Card, Descriptions, Divider, List, Button} from "antd";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {DataStore} from "aws-amplify";
import {Customer, Order, Restaurant} from "../../models";
import {useOrderContext} from "../../contexts/OrderContext";

const DetailedOrder = () => {

    const [customer, setCustomer] = useState({})
    const {order,orderDishes,restaurant} = useOrderContext()

    useEffect(() => {
        if (order) {
            DataStore.query(Customer, order.customerID).then(setCustomer)
        }
    }, [order])
    //
    // useEffect(() => {
    //     console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ order ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(order,null,4))
    //     restaurant &&
    //     DataStore.query(Order, o => o.and(o => [
    //         o.restaurantID.eq(restaurant.id),
    //         o.isDeleted.eq(false),
    //     ])).then(setOrder[0])
    // }, [restaurant])

    return (
        <>
            {customer?.id &&

            <Card title={`Order ${order.id}`} style={{margin: 20}}>
                <Descriptions bordered column={{lg: 1, md: 1, sm: 1}}>
                    <Descriptions.Item label="Customer">
                        {customer.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Customer Address">
                        {customer.location.address}
                    </Descriptions.Item>
                </Descriptions>
                <Divider/>
                <List
                    dataSource={orderDishes}
                    renderItem={(dishItem) => (
                        <List.Item>
                            <div style={{fontWeight: "bold"}}>
                                {dishItem.name} x{dishItem.quantity}
                            </div>
                            <div>{dishItem.price}$</div>
                        </List.Item>
                    )}
                />
                <List.Item>
                    <div style={{fontWeight: "bold"}}>
                        delivery fee:
                    </div>
                    <div>{restaurant.deliveryFee}$</div>
                </List.Item>
                <Divider/>
                <div style={styles.totalSumContainer}>
                    <h2>Total:</h2>
                    <h2 style={styles.totalPrice}>{order.totalPrice}$</h2>
                </div>
                <Divider/>
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
            }
        </>
    )
}

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
