import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'
import { ApolloLink } from 'apollo-link'
import { setContext } from 'apollo-link-context'
/**
 * Create a new apollo client and export as default
 */


const http = new HttpLink({ uri: 'http://localhost:4000/' });
const cache = new InMemoryCache();

/**
 * Add a delay to each request for sample practice
 */
const delay = setContext(request => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 800);
    });
});

/**
 * Create resolvers for local client state extra fields
 */

const typeDefs = gql`   
  extend type User {
    age: Int
  }
`

const resolvers = {
    User: {
        age: () => 35
    }
};
/**
 * Create a new ApolloClient instance - steps to do for configuring client and export as default
 */

const link = ApolloLink.from([
    delay,
    http
]);

const client = new ApolloClient({
    link,
    cache,
    resolvers,
    typeDefs
});
export default client;