import {Button, Card, Descriptions, Divider, List} from "antd";
import {useEffect, useState} from "react";
import {DataStore} from "aws-amplify";
import {Customer, Order} from "../../models";
import {useOrderContext} from "../../contexts/OrderContext";
import "./index.css"

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
                        if (newStatus === "NEW") updated.courierID = "null"
                    })
                )
            )
        setStatus(newStatus)
    }


    return (
        <>
            {customer &&
            <Card title={`Order`} style={{margin: 20}}>


                <List bordered style={{border: "none"}} column={{lg: 1, md: 1, sm: 1}}>
                    <List.Item style={{border: "none"}}>
                        <div>
                            Customer: {customer.name}
                        </div>
                    </List.Item>
                    <List.Item>
                        <div>
                            Customer Address: {customer.location?.address}
                        </div>
                    </List.Item>

                </List>
                <Divider/>

                <List bordered style={{border: "none"}}
                      dataSource={orderDishes}
                      renderItem={(dishItem) => (

                          <List.Item style={{border: "none"}}>
                              <div>
                                  {dishItem.name} x{dishItem.quantity}
                              </div>
                              <div>{dishItem.price}$</div>
                          </List.Item>
                      )}/>

                <List bordered style={{border: "none"}} column={{lg: 1, md: 1, sm: 1}}>
                    <List.Item style={{border: "none"}}>
                        <div>
                            delivery fee:
                        </div>
                        <div>{restaurant.deliveryFee}$</div>
                    </List.Item>

                    <List.Item style={{border: "none"}}>
                        <h2>Total:</h2>
                        <h2 className="totalPrice">{order.totalPrice}$</h2>
                    </List.Item>
                </List>

                {status && <>
                    <div className="buttonsContainer">
                        <Button block style={{backgroundColor: "#D9534F", color: "white"}} size="medium"
                                className="button"
                                disabled={status !== "NEW"}
                                onClick={async () => await updateStatus({id: order.id, newStatus: "DECLINED"})}>
                            Decline Order
                        </Button>
                        <Button block style={{backgroundColor: "#96CEB4", color: "white"}} size="medium"
                                className="button"
                                disabled={status !== "NEW"}
                                onClick={async () => await updateStatus({id: order.id, newStatus: "ACCEPTED"})}>
                            Accept Order
                        </Button>
                    </div>
                    <div className="buttonsContainer2">
                        <Button block size="medium" style={{
                            borderBottom: status === "ACCEPTED" ? "2px solid #FFAD60" : "#f5f5f5",
                            borderRight: "none", borderLeft: "none", borderTop: "none",
                            backgroundColor: "white",
                            color: "black"
                        }} disabled={status !== "ACCEPTED"}
                                onClick={async () => await updateStatus({id: order.id, newStatus: "COOKING"})}>
                            START COOKING :)
                        </Button>
                        <Button block size="medium" style={{
                            borderBottom: status === "COOKING" ? "2px solid #FFAD60" : "#f5f5f5",
                            borderRight: "none", borderLeft: "none", borderTop: "none",
                            backgroundColor: "white",
                            color: "black"
                        }} disabled={status !== "COOKING"}
                                onClick={async () => await updateStatus({id: order.id, newStatus: "READY_FOR_PICKUP"})}>
                            Food Is Done!! ready for pick up!
                        </Button>
                        <Button block size="medium" style={{
                            borderBottom: status === "READY_FOR_PICKUP" ? "2px solid #FFAD60" : "#f5f5f5",
                            borderRight: "none", borderLeft: "none", borderTop: "none",
                            backgroundColor: "white",
                            color: "black"
                        }} disabled={status !== "READY_FOR_PICKUP"}
                                onClick={async () => await updateStatus({id: order.id, newStatus: "PICKED_UP"})}>
                            Order has been picked up!
                        </Button>
                        <Button block size="medium" style={{
                            borderBottom: status === "NEW" ? "2px solid #FFAD60" : "#f5f5f5",
                            borderRight: "none", borderLeft: "none", borderTop: "none",
                            backgroundColor: "white",
                            color: "black"
                        }} disabled={status === "NEW"}
                                onClick={async () => await updateStatus({id: order.id, newStatus: "NEW"})}>
                            **RETURN TO NEW**
                        </Button>

                    </div>
                </>}
            </Card>
            }
        </>
    )
}


export default DetailedOrder;
