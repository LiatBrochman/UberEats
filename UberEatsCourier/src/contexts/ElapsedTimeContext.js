import {createContext, useContext, useEffect, useState} from "react";
import {Amplify, Hub, PubSub} from 'aws-amplify';
import {AWSIoTProvider, CONNECTION_STATE_CHANGE, ConnectionState} from '@aws-amplify/pubsub';

const ElapsedTimeContext = createContext({})

const ElapsedTimeContextProvider = ({children}) => {

    const [isConnected, setIsConnected] = useState(false)
    let priorConnectionState

    /**
     * establishing connection:
     */
    useEffect(() => {

        Amplify.addPluggable(
            new AWSIoTProvider({
                aws_pubsub_region: 'us-east-1',
                aws_pubsub_endpoint: 'wss://a7qe1o6h9jfvb-ats.iot.us-east-1.amazonaws.com.iot.us-east-1.amazonaws.com/mqtt'
            })
        )

        PubSub.subscribe('elapsed-time').subscribe({
            next: data => console.log('Message received', data),
            error: error => console.error(error),
            complete: () => console.log('Done'),
        })


        Hub.listen("pubsub", (data) => {

            const {payload} = data

            if (payload.event === CONNECTION_STATE_CHANGE) {

                /**
                 * connection has been changed!!
                 */

                switch (priorConnectionState + ' ' + payload.data.connectionState) {

                    case ConnectionState.Connecting + ' ' + ConnectionState.Connected:
                        setIsConnected(true)
                        break;

                    case ConnectionState.Connected + ' ' + ConnectionState.Disconnected:
                        setIsConnected(false)
                        break;

                    case ConnectionState.Connected + ' ' + ConnectionState.ConnectionDisrupted:
                        setIsConnected(false)
                        break;

                    case ConnectionState.Connected + ' ' + ConnectionState.ConnectionDisruptedPendingNetwork:
                        setIsConnected(false)
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