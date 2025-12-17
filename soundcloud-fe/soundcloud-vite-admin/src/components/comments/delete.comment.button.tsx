import { DeleteFilled } from '@ant-design/icons';
import { Button, message, notification, Popconfirm } from 'antd';
import { IComment } from './comments.table';

interface IProps {
  record: IComment | null;
  getData: () => void;
}

const DeleteCommentButton = (props: IProps) => {
  const { record, getData } = props;
  const onConfirmDelete = async () => {
    if (record?._id) {
      const accessToken = localStorage.getItem('access_token');

      // Delete user
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/comments/${record._id}`,
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
        message.success(`Comment ${record.content} deleted`);
      } else {
        notification.error({
          message: 'Error deleting track',
          description: JSON.stringify(responseData.message),
        });
      }
    }
  };

  return (
    <Popconfirm
      title="Delete comment"
      description="Are you sure to delete this comment?"
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

export default DeleteCommentButton;
