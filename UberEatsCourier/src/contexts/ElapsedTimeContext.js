import {createContext, useContext, useEffect, useState} from "react";
import {Amplify, Auth, Hub, PubSub} from 'aws-amplify';
import {AWSIoTProvider, CONNECTION_STATE_CHANGE, ConnectionState} from '@aws-amplify/pubsub';
import {useAuthContext} from "./AuthContext";

const ElapsedTimeContext = createContext({})

const ElapsedTimeContextProvider = ({children}) => {

    const [isConnected, setIsConnected] = useState(false)
    const [cognitoIdentityId, setCognitoIdentityId] = useState(null)
    let priorConnectionState
    const {authUser} = useAuthContext()

    /**
     * establishing connection:
     */
    useEffect(() => {

        Auth.currentCredentials().then((info) => {
            const cognitoIdentityId = info.identityId;
            console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ cognitoIdentityId ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(cognitoIdentityId, null, 4))
            setCognitoIdentityId(cognitoIdentityId)
        })

        // Amplify.addPluggable(
        //     new AWSIoTProvider({
        //         aws_pubsub_region: 'us-east-1',
        //         aws_pubsub_endpoint: 'wss://a7qe1o6h9jfvb-ats.iot.us-east-1.amazonaws.com/mqtt'
        //     })
        // )

        PubSub.subscribe('elapsed-time',{ provider: 'AWSIoTProvider' }).subscribe({
            next: data => console.log('Message received', data),
            error: error => console.error(error),
            complete: () => console.log('Done'),
        })


        Hub.listen("pubsub", (data) => {
            console.log("pubsub:")
            const {payload} = data

            if (payload.event === CONNECTION_STATE_CHANGE) {
                console.log(payload.event)

                /**
                 * connection has been changed!!
                 */

                switch (priorConnectionState + ' ' + payload.data.connectionState) {

                    case ConnectionState.Connecting + ' ' + ConnectionState.Connected:
                        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ priorConnectionState + ' ' + payload.data.connectionState ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(priorConnectionState + ' ' + payload.data.connectionState, null, 4))

                        setIsConnected(true)
                        break;

                    case ConnectionState.Connected + ' ' + ConnectionState.Disconnected:
                        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ priorConnectionState + ' ' + payload.data.connectionState ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(priorConnectionState + ' ' + payload.data.connectionState, null, 4))

                        setIsConnected(false)
                        break;

                    case ConnectionState.Connected + ' ' + ConnectionState.ConnectionDisrupted:
                        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ priorConnectionState + ' ' + payload.data.connectionState ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(priorConnectionState + ' ' + payload.data.connectionState, null, 4))

                        setIsConnected(false)
                        break;

                    case ConnectionState.Connected + ' ' + ConnectionState.ConnectionDisruptedPendingNetwork:
                        console.log("\n\n ~~~~~~~~~~~~~~~~~~~~~ priorConnectionState + ' ' + payload.data.connectionState ~~~~~~~~~~~~~~~~~~~~~ :", JSON.stringify(priorConnectionState + ' ' + payload.data.connectionState, null, 4))

                        setIsConnected(false)
                        break;
                }


                priorConnectionState = payload.data.connectionState;

            }
        })

    }, [authUser])


    return <ElapsedTimeContext.Provider value={{
        isConnected
    }}>
        {children}
    </ElapsedTimeContext.Provider>
}


export default ElapsedTimeContextProvider

export const useElapsedTimeContext = () => useContext(ElapsedTimeContext)