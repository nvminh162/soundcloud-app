import {
  Modal,
  Input,
  notification,
  Form,
  FormProps,
  InputNumber,
  Select,
  message,
} from 'antd';
import { useEffect } from 'react';
import { IUser } from './users.table';
const { Option } = Select;

interface IProps {
  getData: () => void;
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (v: boolean) => void;
  record: IUser | null;
  setRecord: (v: IUser | null) => void;
}

const UpdateUserModal = (props: IProps) => {
  const {
    getData,
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    record,
    setRecord,
  } = props;
  const [form] = Form.useForm();

  const handleCloseModal = () => {
    setIsUpdateModalOpen(false);
    setRecord(null);
    form.resetFields();
  };

  useEffect(() => {
    if (record) {
      form.setFieldsValue(record);
    }
  }, [record]);

  const onFinish: FormProps['onFinish'] = async (values) => {
    const accessToken = localStorage.getItem('access_token');

    // Update user
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...values, _id: record?._id }),
    });

    const responseData = await response.json();

    if (responseData.data) {
      getData();
      message.success({
        content: 'User updated successfully',
      });
      handleCloseModal();
    } else {
      notification.error({
        message: 'Error',
        description: JSON.stringify(responseData.message),
      });
    }
  };
  return (
    <Modal
      title="Update user"
      closable={true}
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseModal}
      maskClosable={false}
    >
      <Form
        name="basic"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        form={form}
      >
        <Form.Item
          style={{ marginBottom: 5 }}
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 5 }}
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 5 }}
          label="Password"
          name="password"
          rules={[
            {
              required: !!record?.password,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password disabled={!!!record?.password} />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 5 }}
          label="Age"
          name="age"
          rules={[{ required: true, message: 'Please input your age!' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 5 }}
          name="gender"
          label="Gender"
          rules={[{ required: true, message: 'Please select your gender!' }]}
        >
          <Select placeholder="Select gender" allowClear>
            <Option value="MALE">Male</Option>
            <Option value="FEMALE">Female</Option>
            <Option value="OTHER">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 5 }}
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please input your address!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 5 }}
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Please select role!' }]}
        >
          <Select placeholder="Select Role" allowClear>
            <Option value="ADMIN">Admin</Option>
            <Option value="USER">User</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateUserModal;
