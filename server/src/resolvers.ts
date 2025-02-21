import { User } from "./type";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

let users: User[] = [
  {
    id: "1",
    name: "Alice",
    phone: "12345678901",
    gender: "male",
    email: "alice@example.com",
  },
  {
    id: "2",
    name: "Bob",
    phone: "13980008820",
    gender: "female",
    email: "bob@example.com",
  },
  {
    id: "3",
    name: "Charlie",
    phone: "13567890123",
    gender: "male",
    email: "charlie@example.com",
  },
  {
    id: "4",
    name: "Diana",
    phone: "13876543210",
    gender: "female",
    email: "diana@example.com",
  },
  {
    id: "5",
    name: "Ethan",
    phone: "14725836900",
    gender: "male",
    email: "ethan@example.com",
  },
  {
    id: "6",
    name: "Fiona",
    phone: "15898765432",
    gender: "female",
    email: "fiona@example.com",
  },
  {
    id: "7",
    name: "George",
    phone: "13987654321",
    gender: "male",
    email: "george@example.com",
  },
];

export const resolvers = {
  hello: () => "Hello, world!",
  // 查询
  user: ({ id }: { id: string }): User | undefined => {
    return users.find((user) => user.id === id);
  },
  userList: (): User[] => users,
  // 新增
  addUser: ({
    name,
    email,
    phone,
    gender,
  }: {
    name: string;
    email: string;
    phone: string;
    gender: string;
  }) => {
    const newUser: User = {
      id: String(users.length + 1), // 生成新 ID
      name,
      email,
      phone,
      gender,
    };
    users.push(newUser);
    pubsub.publish("USER_LIST_UPDATED", { userListUpdated: newUser });
    return newUser;
  },
  // 编辑
  updateUser: ({
    id,
    name,
    email,
    phone,
    gender,
  }: {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    gender?: string;
  }) => {
    const user = users.find((user) => user.id === id);
    if (!user) {
      throw new Error("User not found");
    }
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;
    return user;
  },
  // 删除
  deleteUser: ({ id }: { id: string }) => {
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new Error("User not found");
    }
    const deletedUser = users.splice(index, 1)[0];
    pubsub.publish("USER_LIST_UPDATED", { userListUpdated: deletedUser }); // 发布事件
    return deletedUser;
  },
  // 列表订阅
  Subscription: {
    userListUpdated: {
      subscribe: () => pubsub.asyncIterableIterator(["USER_LIST_UPDATED"]),
    },
  },
};
