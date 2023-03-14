import {Button, Card, Divider, List} from "antd";
import {useEffect, useState} from "react";
import {DataStore} from "aws-amplify";
import {Courier, Order} from "../../models";
import {useOrderContext} from "../../contexts/OrderContext";
import "./index.css"
import {useParams} from "react-router-dom";
import {useRestaurantContext} from "../../contexts/RestaurantContext";


const DetailedOrder = () => {

    const {orderID} = useParams()
    const {restaurant} = useRestaurantContext()
    const {
        order,
        orderDishes,
        courier,
        setCourier,
        customer,
        setOrder,
        couriers,
        ETAs,
        countETAs
    } = useOrderContext({ETAs:[]})
    const [status, setStatus] = useState(order?.status)
    const [ETA,setETA]=useState()


    useEffect(() => {
        if (!orderID) return;
        DataStore.query(Order, orderID).then(setOrder)
    }, [orderID])


    useEffect(() => {
        order && setStatus(order.status)
    }, [order])


    useEffect(() => {
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ couriers.length  ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(couriers.length ,null,4))

        if (couriers.length === 0) {
            setCourier(null)
            return;
        }
        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ order ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(order,null,4))

       if( order && order.courierID !== "null"  ) {
           // setCourier(couriers.find(c => c.id === order.courierID))
           let courier = couriers.find(c => c.id === order.courierID)
           console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ courier ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(courier,null,4))

           setCourier(courier)

       }
    }, [order,couriers.length])

    useEffect(()=>{
        if(ETAs.length===0 || !courier) {
            return
        }

        setETA(ETAs.find(ETA=>ETA.courierID===courier.id))
    },[countETAs,couriers.length])


    const updateStatus = async ({id, newStatus}) => {

        if (newStatus === "NEW") {
            DataStore.query(Order, id)
                .then(order => DataStore.save(
                        Order.copyOf(order, (updated) => {
                            updated.status = newStatus
                            updated.courierID = "null"
                        })
                    )
                )
            courier && DataStore.query(Courier, courier.id)
                .then(courier => DataStore.save(
                        Courier.copyOf(courier, (updated) => {
                            updated.orderID = "null"
                        })
                    )
                )
        } else {
            DataStore.query(Order, id)
                .then(order => DataStore.save(
                        Order.copyOf(order, (updated) => {
                            updated.status = newStatus
                        })
                    )
                )
        }

        setStatus(newStatus)
    }


    function getRestaurantArrivalTime() {
        if (courier) {
            switch (courier.timeToArrive.length) {

                case 0:
                    return ""

                case 1:
                    return ""

                case 2:
                    return courier.timeToArrive[0]
            }
        }
        return ""
    }


    function getCustomerArrivalTime() {
        if (courier) {
            switch (courier.timeToArrive.length) {

                case 0:
                    return ""

                case 1:
                    return courier.timeToArrive[0]

                case 2:
                    return courier.timeToArrive[1]
            }
        }
        return ""
    }

    return (
        <>
            {order && customer && status && orderDishes && restaurant &&
            <Card title={`Order`} style={{margin: 20}}>

                <List bordered style={{border: "none"}} column={{lg: 1, md: 1, sm: 1}}>
                    <List.Item style={{border: "none"}}>
                        <div>
                            Customer: {customer && customer.name}
                        </div>
                    </List.Item>
                    <List.Item style={{border: "none"}}>
                        <div>
                            Customer Address: {customer.location.address}
                        </div>
                    </List.Item>
                    <List.Item style={{border: "none"}}>
                        <div>
                            Courier Name: {courier && courier.name}
                        </div>
                    </List.Item>
                    <List.Item style={{border: "none"}}>
                        <div>
                            Restaurant Time: {ETA && ETA.restaurant}
                        </div>
                    </List.Item>
                    <List.Item style={{border: "none"}}>
                        <div>
                            Customer Time: {ETA && ETA.customer}
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
                            onClick={async () => await updateStatus({
                                id: order.id,
                                newStatus: "READY_FOR_PICKUP"
                            })}>
                        Food Is Done!! ready for pick up!
                    </Button>
                    <Button block size="medium" style={{
                        borderBottom: status === "READY_FOR_PICKUP" ? "2px solid #FFAD60" : "#f5f5f5",
                        borderRight: "none", borderLeft: "none", borderTop: "none",
                        backgroundColor: "white",
                        color: "black"
                    }} disabled={status !== "READY_FOR_PICKUP"}
                            onClick={async () => order.courierID === courier.id && await updateStatus({
                                id: order.id,
                                newStatus: "PICKED_UP"
                            })}>
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

            </Card>
            }
        </>
    )
}


export default DetailedOrder;
