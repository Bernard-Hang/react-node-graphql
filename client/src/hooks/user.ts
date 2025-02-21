import { useQuery, gql, useMutation } from "@apollo/client";

export interface User {
  id?: string;
  phone: string;
  gender: string;
  name: string;
  email: string;
}
// 查询用户
const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      phone
      gender
    }
  }
`;
// 新增用户
const ADD_USER = gql`
  mutation AddUser(
    $name: String!
    $email: String!
    $phone: String!
    $gender: String!
  ) {
    addUser(name: $name, email: $email, phone: $phone, gender: $gender) {
      id
      name
      email
      phone
      gender
    }
  }
`;

// 编辑用户
const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $name: String!
    $email: String!
    $phone: String!
    $gender: String!
  ) {
    updateUser(
      id: $id
      name: $name
      email: $email
      phone: $phone
      gender: $gender
    ) {
      id
      name
      email
      phone
      gender
    }
  }
`;

// 删除用户
const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      name
    }
  }
`;
export const useGetUser = (id: string) => {
  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id },
    skip: !id, // 如果没有提供 id，则跳过查询
  });

  return {
    loading,
    error,
    user: data ? data.user : null,
  };
};

export const useAddUser = () => {
  const [addUser, { loading, error }] = useMutation(ADD_USER);

  const executeAddUser = async (userData: User) => {
    const { name, email, phone, gender } = userData;
    try {
      const { data } = await addUser({
        variables: { name, email, phone, gender },
      });
      return data.addUser; // 返回新增的用户信息
    } catch (e) {
      console.error(e);
      throw e; // 处理错误
    }
  };

  return { executeAddUser, loading, error };
};

// 封装编辑用户的方法
export const useUpdateUser = () => {
  const [updateUser, { loading, error }] = useMutation(UPDATE_USER);

  const executeUpdateUser = async (userData: User) => {
    const { id, name, email, phone, gender } = userData;
    try {
      const { data } = await updateUser({
        variables: { id, name, email, phone, gender },
      });
      return data.updateUser; // 返回更新的用户信息
    } catch (e) {
      console.error(e);
      throw e; // 处理错误
    }
  };

  return { executeUpdateUser, loading, error };
};

// 封装删除用户的方法
export const useDeleteUser = () => {
  const [deleteUser, { loading, error }] = useMutation(DELETE_USER);

  const executeDeleteUser = async (id: string) => {
    try {
      const { data } = await deleteUser({ variables: { id } });
      return data.deleteUser; // 返回被删除的用户信息
    } catch (e) {
      console.error(e);
      throw e; // 处理错误
    }
  };

  return { executeDeleteUser, loading, error };
};

// export const useUserListSubscription = (onUserListUpdated) => {
//   useSubscription(USER_LIST_SUBSCRIPTION, {
//     onSubscriptionData: ({ subscriptionData }) => {
//       if (subscriptionData.data) {
//         onUserListUpdated(subscriptionData.data.userListUpdated);
//       }
//     },
//   });
// };
