import { Button, message, notification, Popconfirm } from 'antd';
import { ITrack } from './tracks.table';
import { DeleteFilled } from '@ant-design/icons';

interface IProps {
  record: ITrack | null;
  getData: () => void;
}

const DeleteTrackButton = (props: IProps) => {
  const { record, getData } = props;

  const onConfirmDelete = async () => {
    if (record?._id) {
      const accessToken = localStorage.getItem('access_token');

      // Delete user
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/tracks/${record._id}`,
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
        message.success(`Track ${record.title} deleted`);
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
      title="Delete track"
      description="Are you sure to delete this track?"
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

export default DeleteTrackButton;
