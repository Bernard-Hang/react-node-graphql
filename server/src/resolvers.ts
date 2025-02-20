import { User } from "./type";

const users: User[] = [
  { id: "1", name: "Alice", email: "alice@example.com" },
  { id: "2", name: "Bob", email: "bob@example.com" },
];

export const resolvers = {
  hello: () => "Hello, world!",
  user: ({ id }: { id: string }): User | undefined => {
    return users.find((user) => user.id === id);
  },
};
