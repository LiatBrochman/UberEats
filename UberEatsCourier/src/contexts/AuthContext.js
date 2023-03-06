import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {Auth, Hub} from "aws-amplify";

const AuthContext = createContext({});

const AuthContextProvider = ({children}) => {
    const [authUser, setAuthUser] = useState(null)
    const [customState, setCustomState] = useState(null)
    const sub = authUser?.attributes?.sub
    const googleSignin = useCallback(() => {
        Auth.federatedSignIn({provider: 'Google'}).then(setAuthUser)
    }, [])
    const cognitoSignIn = useCallback(() => {
        Auth.federatedSignIn().then(setAuthUser)
    }, [])
    const signOut = useCallback(() => {
        Auth.signOut({global: true}).then(() => setAuthUser(null))
    }, [])

    useEffect(() => {

        const unsubscribe = Hub.listen('auth', (data) => {

            switch (data.payload.event) {
                case 'signIn':
                    console.log('user signed in')
                    Auth.currentAuthenticatedUser({bypassCache: true}).then(setAuthUser)
                    break;
                case 'signUp':
                    console.log('user signed up')
                    Auth.currentAuthenticatedUser({bypassCache: true}).then(setAuthUser)
                    break;
                case 'signOut':
                    console.log('user signed out')
                    setAuthUser(null)
                    break;
                case "customOAuthState":
                    setCustomState(data);
                    break;
                case 'signIn_failure':
                    console.log('user sign in failed')
                    break;
                case 'configured':
                    console.log('the Auth module is configured')
                    Auth.currentAuthenticatedUser({bypassCache: true}).then(setAuthUser)
                    break;
            }
        })
        Auth.currentAuthenticatedUser({bypassCache: true})
            .then((currentUser) => setAuthUser(currentUser))
            .catch(() => console.log("Not signed in"))

        return unsubscribe
    }, [])



    return (
        <AuthContext.Provider value={{authUser, sub, googleSignin, cognitoSignIn, signOut}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext)
