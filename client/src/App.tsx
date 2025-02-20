import { ApolloProvider, useQuery, gql } from "@apollo/client";
import client from "./graphql/client";
import "./index.css"; // 引入 Tailwind CSS

// 定义 GraphQL 查询
const GET_HELLO = gql`
  query {
    hello
  }
`;

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
`;

// Hello 组件
function Hello() {
  const { loading, error, data } = useQuery(GET_HELLO);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <h1>{data.hello}</h1>;
}

// User 组件
function User({ id }: { id: string }) {
  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>User Details</h2>
      <p>ID: {data.user.id}</p>
      <p>Name: {data.user.name}</p>
      <p>Email: {data.user.email}</p>
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <div style={{ textAlign: "center" }}>
        <Hello />
        <User id="2" />
      </div>
    </ApolloProvider>
  );
}

export default App;
