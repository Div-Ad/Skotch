import VueApollo from 'vue-apollo'
import { ApolloClient, DefaultOptions } from 'apollo-client'
import { onError } from 'apollo-link-error'
import {MessageTypes, SubscriptionClient} from 'subscriptions-transport-ws'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import store from '../store/index'
// New Imports
import { fromPromise, split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import * as localforage from 'localforage'
import firebase from 'firebase/app'
import 'firebase/auth'

const httpLink = new HttpLink({
    // You should use an absolute URL here
    uri: process.env.HASURA_API_URL
})

const getToken = () => {
    return firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            user.getIdToken(true)
                .then(function (idToken) {
                    return idToken
                })
                .catch(function (error) {})
        }
    })
}

// Create the subscription websocket link
export const wsClient = new SubscriptionClient(
    process.env.HASURA_WS_URL,
    {
        lazy: true,
        reconnect: true,
        timeout: (1000*60*50),
        connectionParams: async () => {
            const localForage = await localforage.getItem('skotch')
            return {
                headers: {
                    Authorization: `Bearer ${localForage.token}`
                }
            }
        },
        onError: (error) => {
            if (error?.extensions.code === 'start-failed') {
                alert('ws not working anymore')
                console.log('on error ws client')
                wsClient.subscriptionClient.close(false, false)
                wsClient.connect()
                Object.keys(wsClient.operations).forEach((id) => {
                    wsClient.sendMessage(id, MessageTypes.GQL_START, wsClient.operations[id].options);
                })
            }
        }
})

export const wsLink = new WebSocketLink(wsClient)

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = store.state.token
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : ''
        }
    }
})

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
        for (let err of graphQLErrors) {
            switch (err.extensions.code) {
                case 'start-failed':
                    return fromPromise(
                        getToken().catch((error) => {
                            console.log(error)
                            console.log('error link errorLink')
                            return
                        })
                    )
                        .filter((value) => Boolean(value))
                        .flatMap((token) => {
                            const oldHeaders = operation.getContext().headers
                            operation.setContext({
                                headers: {
                                    ...oldHeaders,
                                    authorization: `Bearer ${token}`
                                }
                            })
                            return forward(operation)
                        })
            }
        }
    }
})

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
    // split based on operation type
    ({ query }) => {
        const definition = getMainDefinition(query)
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    wsLink,
    httpLink
)

const defaultOptions = {
    watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore'
    },
    query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all'
    },
    fetchOptions: {
        mode: 'no-cors',
    }
}

export const apolloClient = new ApolloClient({
    link: authLink.concat(link),
    connectToDevTools: true,
    cache: new InMemoryCache(),
    defaultOptions
})

const apolloProvider = new VueApollo({
    defaultClient: apolloClient
})

export default ({ Vue, app }) => {
    Vue.use(VueApollo)
    app.apolloProvider = apolloProvider
}
