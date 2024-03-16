import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'

/**
 * Create a new apollo client and export as default
 */


const link = new HttpLink({ uri: 'http://localhost:4000/' });
const cache = new InMemoryCache();

const client = new ApolloClient({
    link,
    cache
});

const query = gql`
{ 
    pets {
        id
        name
        type
        img
    
    }
}
`;

client.query({ query }).then(result => {
    console.log("results =>", result);
});

export default client;