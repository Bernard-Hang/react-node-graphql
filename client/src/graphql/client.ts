import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql", // GraphQL 服务器地址
  cache: new InMemoryCache(),
});

export default client;
