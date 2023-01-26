import {Button, Card, Descriptions, Divider, List} from "antd";
import {useEffect, useState} from "react";
import {DataStore} from "aws-amplify";
import {Customer, Order} from "../../models";
import {useOrderContext} from "../../contexts/OrderContext";

const DetailedOrder = () => {

    const {order, orderDishes, restaurant} = useOrderContext()
    const [customer, setCustomer] = useState(null)
    const [status, setStatus] = useState(order?.status)

    useEffect(() => {
        DataStore.query(Customer, order?.customerID).then(setCustomer)
    }, [order])


    const updateStatus = async ({id, newStatus}) => {
        DataStore.query(Order, id)
            .then(order => DataStore.save(
                    Order.copyOf(order, (updated) => {
                        updated.status = newStatus
                        if(newStatus==="NEW") updated.courierID="null"
                    })
                )
            )
        setStatus(newStatus)
    }


    return (
        <>
            {customer && order?.id &&

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
                {status && <>
                    <div style={styles.buttonsContainer}>
                        <Button block type="danger" size="large" style={styles.button}
                                disabled={status !== "NEW"}
                                onClick={async () => await updateStatus({id:order.id,newStatus:"DECLINED"})}>
                            Decline Order
                        </Button>
                        <Button block type="primary" size="large" style={styles.button}
                                disabled={status !== "NEW"}
                                onClick={async () => await updateStatus({id:order.id,newStatus:"ACCEPTED"})}>
                            Accept Order
                        </Button>
                    </div>
                    <Button block type="primary" size="large" disabled={status !== "ACCEPTED"}
                            onClick={async () => await updateStatus({id:order.id,newStatus:"COOKING"})}>
                        START COOKING :)
                    </Button>
                    <Button block type="primary" size="large" disabled={status !== "COOKING"}
                            onClick={async () => await updateStatus({id:order.id,newStatus:"READY_FOR_PICKUP"})}>
                        Food Is Done!! ready for pick up!
                    </Button>
                    <Button block type="primary" size="large" disabled={status !== "READY_FOR_PICKUP"}
                            onClick={async () => await updateStatus({id:order.id,newStatus:"PICKED_UP"})}>
                        Order has been picked up!
                    </Button>
                    <Button block type="primary" size="large" disabled={status === "NEW"}
                            onClick={async () => await updateStatus({id:order.id,newStatus:"NEW"})}>
                        **RETURN TO NEW**
                    </Button>

                </>}
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
