import { buildSchema } from "graphql";

export const schema = buildSchema(`
  type Query {
    hello: String
    user(id: ID!): User
    userList: [User!]!  # 新增查询字段，返回 User 数组
  }

  type Mutation {
    addUser(name: String!, email: String!, phone: String!, gender: String!): User!
    updateUser(id: ID!, name: String, email: String, phone: String, gender: String): User!
    deleteUser(id: ID!): User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    phone: String!
    gender: String!
  }
  type Subscription {
    userListUpdated: User!
  }
`);
