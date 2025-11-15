import { ProfileOutlined } from '@ant-design/icons';

const icons = {
  ProfileOutlined
};

const fifo = {
  id: 'fifo-group',
  title: 'Memory Simulator',
  type: 'group',
  children: [
    {
      id: 'fifo-simulator',
      title: 'FIFO Simulator',
      type: 'item',
      url: '/fifo',
      icon: icons.ProfileOutlined
    }
  ]
};

export default fifo;
