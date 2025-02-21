import { ApolloProvider, useQuery, gql } from "@apollo/client";
import client from "./graphql/client";
import { Table, Space, Button, Modal, Form, Input } from "antd";
import {
  User,
  useGetUser,
  useAddUser,
  useUpdateUser,
  useDeleteUser,
} from "./hooks/user";
import { useState } from "react";

type FieldType = {
  id?: string;
  phone?: string;
  gender?: string;
  name?: string;
  email?: string;
};

// 定义 GraphQL 查询
const GET_HELLO = gql`
  query {
    hello
  }
`;

const GET_USER_LIST = gql`
  query GetUserList {
    userList {
      id
      name
      email
      phone
      gender
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

function App() {
  const [form] = Form.useForm();
  const { loading, data: users, refetch } = useQuery(GET_USER_LIST);
  const [userId, setUserId] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<FieldType>();
  const [mode, setMode] = useState("");
  const { user } = useGetUser(userId);
  const { executeAddUser } = useAddUser();
  const { executeUpdateUser } = useUpdateUser();
  const { executeDeleteUser } = useDeleteUser();

  const columns = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "性别",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "电话",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: User) => (
        <Space size="middle">
          <Button
            onClick={() => {
              setUserId(record.id!);
              setDetailOpen(true);
            }}
          >
            详情
          </Button>
          <Button
            onClick={() => {
              setMode("edit");
              setUserId(record.id!);
              setUserInfo(record);
              setEditOpen(true);
            }}
          >
            编辑
          </Button>
          <Button
            onClick={() => {
              handleDeleteUser(record.id!);
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleDeleteUser = async (id: string) => {
    try {
      const deletedUser = await executeDeleteUser(id);
      console.log("User deleted:", deletedUser);
      refetch();
    } catch (error) {
      console.error("Delete user error:", error);
    }
  };

  async function onFinish() {
    const value = await form.validateFields(); // 验证表单
    console.log("value", value);
    if (mode === "add") {
      const res = await executeAddUser({
        name: value?.name,
        phone: value?.phone,
        gender: value?.gender,
        email: value?.email,
      });
      refetch();
      setEditOpen(false);
      console.log("res", res);
    } else {
      const res = await executeUpdateUser({
        id: userId,
        name: value?.name,
        phone: value?.phone,
        gender: value?.gender,
        email: value?.email,
      });
      refetch();
      setEditOpen(false);
      console.log("res", res);
    }
  }

  return (
    <ApolloProvider client={client}>
      <div style={{ textAlign: "center" }}>
        <Hello />
        <Button
          onClick={() => {
            setMode("add");
            setUserInfo({});
            setEditOpen(true);
          }}
          type="primary"
          style={{ marginBottom: "30px" }}
        >
          新增用户
        </Button>
        <Table
          loading={loading}
          dataSource={users ? users.userList : []}
          columns={columns}
        />
        <Modal
          title="用户详情"
          open={detailOpen}
          onCancel={() => setDetailOpen(false)}
          footer={[]}
        >
          {/* {user && ( */}
          <div>
            <h1>{user?.name}</h1>
            <p>Email: {user?.email}</p>
            <p>Phone: {user?.phone}</p>
            <p>Gender: {user?.gender}</p>
          </div>
          {/* )} */}
        </Modal>
        <Modal
          title={mode === "add" ? "新增用户" : "编辑用户"}
          open={editOpen}
          onCancel={() => {
            setEditOpen(false);
            setUserInfo({});
          }}
          onOk={onFinish}
        >
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            form={form}
            autoComplete="off"
            initialValues={userInfo}
          >
            <Form.Item<FieldType> label="姓名" name="name">
              <Input />
            </Form.Item>

            <Form.Item<FieldType> label="性别" name="gender">
              <Input />
            </Form.Item>
            <Form.Item<FieldType> label="电话" name="phone">
              <Input />
            </Form.Item>
            <Form.Item<FieldType> label="邮箱" name="email">
              <Input />
            </Form.Item>

            {/* <Form.Item label={null}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item> */}
          </Form>
        </Modal>
      </div>
    </ApolloProvider>
  );
}

export default App;
