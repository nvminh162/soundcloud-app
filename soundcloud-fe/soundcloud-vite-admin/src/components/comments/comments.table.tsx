import { notification } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import DeleteCommentButton from './delete.comment.button';

export interface IComment {
  _id: string;
  content: string;
  moment: number;
  user: {
    _id: string;
    email: string;
    name: string;
    role: string;
    type: string;
  };
  track: {
    _id: string;
    title: string;
    description: string;
    trackUrl: string;
  };
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

const CommentsTable = () => {
  const [listComments, setlistComments] = useState<IComment[]>([]);
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });

  const getData = async () => {
    const accessToken = localStorage.getItem('access_token');

    // Fetch list track
    const commentsRes = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/comments?current=${meta.current}&pageSize=${meta.pageSize}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const commentsData = await commentsRes.json();

    if (!commentsData.data) {
      notification.error({
        message: 'Error',
        description: JSON.stringify(commentsData?.message),
      });
    }

    setlistComments(commentsData.data.result);
    setMeta(commentsData.data.meta);
  };

  const onPaginationChange = async (page: number, pageSize: number) => {
    const accessToken = localStorage.getItem('access_token');

    // Fetch list user
    const commentsRes = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/comments?current=${page}&pageSize=${pageSize}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const commentsData = await commentsRes.json();

    if (!commentsData.data) {
      notification.error({
        message: 'Error',
        description: JSON.stringify(commentsData?.message),
      });
    }

    setlistComments(commentsData.data.result);
    setMeta(commentsData.data.meta);
  };

  useEffect(() => {
    getData();
  }, []);

  const columns: ColumnsType<IComment> = [
    {
      title: 'STT',
      dataIndex: '_id',
      render: (_, __, index) => {
        return index + 1 + (meta.current - 1) * meta.pageSize;
      },
    },
    {
      title: 'Content',
      dataIndex: 'content',
    },
    {
      title: 'Track',
      dataIndex: ['track', 'title'],
    },
    {
      title: 'User',
      dataIndex: ['user', 'name'],
    },
    {
      title: 'Actions',
      render: (_, record) => {
        return (
          <div style={{ display: 'flex', gap: '5px' }}>
            <DeleteCommentButton record={record} getData={getData} />
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
        <h2>Comments Table</h2>
      </div>
      <Table
        columns={columns}
        dataSource={listComments}
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

export default CommentsTable;
