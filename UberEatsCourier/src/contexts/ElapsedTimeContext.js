import {createContext, useContext, useEffect, useState} from "react";
import {Amplify, Auth, Hub, PubSub} from 'aws-amplify';
import {AWSIoTProvider, CONNECTION_STATE_CHANGE, ConnectionState} from '@aws-amplify/pubsub';


const ElapsedTimeContext = createContext({})

const ElapsedTimeContextProvider = ({children}) => {

    const [isConnected, setIsConnected] = useState(false)
    const [cognitoIdentityId, setCognitoIdentityId] = useState(null)
    let priorConnectionState;
    // let endpoint = 'a7qe1o6h9jfvb-ats.iot.us-east-1.amazonaws.com';


    /**
     * establishing connection:
     */
    useEffect(() => {


        // Auth.currentCredentials().then((info) => {
        //     const cognitoIdentityId = info.identityId;
        //     console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ cognitoIdentityId ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(cognitoIdentityId, null, 4))
        //     setCognitoIdentityId(cognitoIdentityId)
        // })
        // Amplify.addPluggable(new AWSIoTProvider({
        //         aws_pubsub_region: 'us-east-1',
        //         aws_pubsub_endpoint: `wss://${endpoint}/mqtt`
        //     })
        // )
        // Amplify.addPluggable(
        //     new AWSIoTProvider({
        //         aws_pubsub_region: 'us-east-1',
        //         aws_pubsub_endpoint: 'wss://a7qe1o6h9jfvb-ats.iot.us-east-1.amazonaws.com/mqtt'
        //     })
        // )
        // PubSub.subscribe('myTopic').subscribe({
        //     next: data => console.log('Message received', data),
        //     error: error => console.error(error),
        //     complete: () => console.log('Done'),
        // })


        PubSub.subscribe('myTopic').subscribe({
            next: data => console.log('Message received', data),
            error: error => console.error(error),
            complete: () => console.log('Done')
        })
        Hub.listen("pubsub", (data) => {

            const {payload} = data

            if (payload.event === CONNECTION_STATE_CHANGE) {
                console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ payload.data.connectionState ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(payload.data.connectionState, null, 4))

                // if(payload.data.connectionState===ConnectionState.ConnectionDisrupted){
                // console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ payload ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(payload,null,4))
                // }

                /**
                 * connection has been changed!!
                 */

                switch (priorConnectionState + ' ' + payload.data.connectionState) {

                    case ConnectionState.Connecting + ' ' + ConnectionState.Connected:
                        setIsConnected(true)
                        PubSub.publish("myTopic",{msg:"from COURIER"})
                        break;

                    case ConnectionState.Connected + ' ' + ConnectionState.Disconnected:
                        setIsConnected(false)
                       PubSub.publish("myTopic",{msg:"from COURIER"})
                        break;

                    case ConnectionState.Connected + ' ' + ConnectionState.ConnectionDisrupted:
                        setIsConnected(false)
                        PubSub.publish("myTopic",{msg:"from COURIER"})
                        break;

                    case ConnectionState.Connected + ' ' + ConnectionState.ConnectionDisruptedPendingNetwork:
                        setIsConnected(false)
                        PubSub.publish("myTopic",{msg:"from COURIER"})
                        break;
                }


                priorConnectionState = payload.data.connectionState;

            }
        })

    }, [])


    return <ElapsedTimeContext.Provider value={{
        isConnected
    }}>
        {children}
    </ElapsedTimeContext.Provider>
}


export default ElapsedTimeContextProvider

export const useElapsedTimeContext = () => useContext(ElapsedTimeContext)