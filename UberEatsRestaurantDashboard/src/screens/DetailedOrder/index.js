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
        liveOrders,
        completedOrders,
        orderDishes,
        courier,
        setCourier,
        customer,
        setOrder,
        couriers,
        ETAs,
        countETAs,
        countLiveUpdates,
        getRestaurantArrivalTime,
        getCustomerArrivalTime
    } = useOrderContext({ETAs: []})
    const [ETA, setETA] = useState({courierID: null, customer: null, restaurant: null})

    useEffect(() => {
        if (!orderID) return;

        const order = liveOrders.find(o => o.id === orderID) || completedOrders.find(o => o.id === orderID)
        setOrder(order)

        const courier = couriers.find(c => c.id === order.courierID)
        setCourier(courier)

        const ETA = ETAs.find(ETA => ETA.courierID === courier?.id)
        setETA(ETA||{restaurant:"",customer:""})

        // DataStore.query(Order, orderID).then(order => {
        //     setOrder(order)
        //     DataStore.query(Courier, c => c.id.eq(order.courierID)).then(([courier])=>{
        //         if(courier){
        //             setCourier(courier)
        //             setETA({restaurant: getRestaurantArrivalTime(courier), customer: getCustomerArrivalTime(courier)})
        //         }
        //     })
        // })
    }, [orderID, countETAs, countLiveUpdates])

    // useEffect(() => {
    //     if (!order) return;
    //
    //     if (couriers.length > 0) {
    //         setCourier(couriers.find(c => c.id === order.courierID))
    //     }
    //     // setStatus(order.status)
    // }, [order])

    // useEffect(() => {
    //     console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ couriers.length  ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(couriers.length, null, 4))
    //
    //     if (couriers.length === 0) {
    //         setCourier(null)
    //         return;
    //     }
    //     console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ order ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(order, null, 4))
    //
    //     if (order && order.courierID !== "null") {
    //         // setCourier(couriers.find(c => c.id === order.courierID))
    //         let courier = couriers.find(c => c.id === order.courierID)
    //         console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ courier ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(courier, null, 4))
    //
    //         setCourier(courier)
    //
    //     }
    // }, [order, couriers.length])

    // useEffect(() => {
    //     if (!courier) return;
    //
    //     setETA({restaurant: getRestaurantArrivalTime(courier), customer: getCustomerArrivalTime(courier)})
    //
    // }, [courier])

    // useEffect(() => {
    //
    //     if (ETAs.length === 0 || !courier) return;
    //
    //     const ETA=ETAs.find(ETA => ETA.courierID === courier.id)
    //     setETA(ETA)
    //
    // }, [countETAs])


    const updateStatus = async ({id, newStatus}) => {

        if (newStatus === "NEW") {
            DataStore.query(Order, id)
                .then(order => DataStore.save(
                        Order.copyOf(order, (updated) => {
                            updated.status = "NEW"
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

        // setStatus(newStatus)
    }


    return (
        <>
            {order && customer && orderDishes && restaurant &&
            <Card title={`Order`} style={{margin: 20}}>

                <List bordered style={{border: "none"}} column={{lg: 1, md: 1, sm: 1}}>
                    <List.Item style={{border: "none"}}>
                        <div>
                            Customer: {customer.name}
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
                            disabled={order.status !== "NEW"}
                            onClick={async () => await updateStatus({id: order.id, newStatus: "DECLINED"})}>
                        Decline Order
                    </Button>
                    <Button block style={{backgroundColor: "#96CEB4", color: "white"}} size="medium"
                            className="button"
                            disabled={order.status !== "NEW"}
                            onClick={async () => await updateStatus({id: order.id, newStatus: "ACCEPTED"})}>
                        Accept Order
                    </Button>
                </div>
                <div className="buttonsContainer2">
                    <Button block size="medium" style={{
                        borderBottom: order.status === "ACCEPTED" ? "2px solid #FFAD60" : "#f5f5f5",
                        borderRight: "none", borderLeft: "none", borderTop: "none",
                        backgroundColor: "white",
                        color: "black"
                    }} disabled={order.status !== "ACCEPTED"}
                            onClick={async () => await updateStatus({id: order.id, newStatus: "COOKING"})}>
                        START COOKING :)
                    </Button>
                    <Button block size="medium" style={{
                        borderBottom: order.status === "COOKING" ? "2px solid #FFAD60" : "#f5f5f5",
                        borderRight: "none", borderLeft: "none", borderTop: "none",
                        backgroundColor: "white",
                        color: "black"
                    }} disabled={order.status !== "COOKING"}
                            onClick={async () => await updateStatus({
                                id: order.id,
                                newStatus: "READY_FOR_PICKUP"
                            })}>
                        Food Is Done!! ready for pick up!
                    </Button>
                    <Button block size="medium" style={{
                        borderBottom: order.status === "READY_FOR_PICKUP" ? "2px solid #FFAD60" : "#f5f5f5",
                        borderRight: "none", borderLeft: "none", borderTop: "none",
                        backgroundColor: "white",
                        color: "black"
                    }} disabled={order.status !== "READY_FOR_PICKUP"}
                            onClick={async () => order.courierID === courier.id && await updateStatus({
                                id: order.id,
                                newStatus: "PICKED_UP"
                            })}>
                        Order has been picked up!
                    </Button>
                    <Button block size="medium" style={{
                        borderBottom: order.status === "NEW" ? "2px solid #FFAD60" : "#f5f5f5",
                        borderRight: "none", borderLeft: "none", borderTop: "none",
                        backgroundColor: "white",
                        color: "black"
                    }} disabled={order.status === "NEW"}
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
