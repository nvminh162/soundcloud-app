import { EditFilled, PlusOutlined } from '@ant-design/icons';
import { Button, notification } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import DeleteTrackButton from './delete.track.button';

export interface ITrack {
  _id: string;
  title: string;
  description: string;
  category: string;
  imgUrl: string;
  trackUrl: string;
  countLike: number;
  countPlay: number;
  uploader: {
    _id: string;
    email: string;
    name: string;
    role: string;
    type: string;
  };
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

const TracksTable = () => {
  const [listTracks, setListTracks] = useState<ITrack[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [record, setRecord] = useState<null | ITrack>(null);
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });

  const getData = async () => {
    const accessToken = localStorage.getItem('access_token');

    // Fetch list track
    const tracksRes = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/tracks?current=${meta.current}&pageSize=${meta.pageSize}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const tracksData = await tracksRes.json();

    if (!tracksData.data) {
      notification.error({
        message: 'Error',
        description: JSON.stringify(tracksData?.message),
      });
    }

    setListTracks(tracksData.data.result);
    setMeta(tracksData.data.meta);
  };

  const onClickUpdate = (record: ITrack) => {
    setRecord(record);
    setIsUpdateModalOpen(true);
  };

  const onPaginationChange = async (page: number, pageSize: number) => {
    const accessToken = localStorage.getItem('access_token');

    // Fetch list user
    const usersRes = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/tracks?current=${page}&pageSize=${pageSize}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const tracksData = await usersRes.json();

    if (!tracksData.data) {
      notification.error({
        message: 'Error',
        description: JSON.stringify(tracksData?.message),
      });
    }

    setListTracks(tracksData.data.result);
    setMeta(tracksData.data.meta);
  };

  useEffect(() => {
    getData();
  }, []);

  const columns: ColumnsType<ITrack> = [
    {
      title: 'STT',
      dataIndex: '_id',
      render: (_, __, index) => {
        return index + 1 + (meta.current - 1) * meta.pageSize;
      },
    },
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Category',
      dataIndex: 'category',
    },
    {
      title: 'Track url',
      dataIndex: 'trackUrl',
    },
    {
      title: 'Uploader',
      dataIndex: ['uploader', 'name'],
    },
    {
      title: 'Actions',
      render: (_, record) => {
        return (
          <div style={{ display: 'flex', gap: '5px' }}>
            <Button
              type="default"
              icon={<EditFilled />}
              onClick={() => onClickUpdate(record)}
            >
              Edit
            </Button>
            <DeleteTrackButton record={record} getData={getData} />
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          display: 'flex',
        }}
      >
        <h2>Tracks Table</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          New track
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={listTracks}
        rowKey={'_id'}
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          total: meta.total,
          showTotal: (total, range) =>
            `Showing ${range[0]} - ${range[1]} of ${total} items`,
          onChange: onPaginationChange,
          showSizeChanger: true,
        }}
      />
    </div>
  );
};

export default TracksTable;
