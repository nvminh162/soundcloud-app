import { Button, message, notification, Popconfirm } from 'antd';
import { IUser } from './users.table';
import { DeleteFilled } from '@ant-design/icons';

interface IProps {
  record: IUser | null;
  getData: () => void;
}

const DeleteUserButton = (props: IProps) => {
  const { record, getData } = props;

  const onConfirmDelete = async () => {
    if (record?._id) {
      const accessToken = localStorage.getItem('access_token');

      // Delete user
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/${record._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const responseData = await response.json();

      if (responseData.data) {
        getData();
        message.success(`User ${record.name} deleted`);
      } else {
        notification.error({
          message: 'Error deleting user',
          description: JSON.stringify(responseData.message),
        });
      }
    }
  };

  return (
    <Popconfirm
      title="Delete user"
      description="Are you sure to delete this user?"
      onConfirm={onConfirmDelete}
      onCancel={() => {}}
      okText="Yes"
      cancelText="No"
    >
      <Button danger type="primary" icon={<DeleteFilled />}>
        Delete
      </Button>
    </Popconfirm>
  );
};

export default DeleteUserButton;
