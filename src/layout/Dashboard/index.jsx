// src/layout/Dashboard/index.jsx

import { Outlet } from 'react-router-dom';
import { ConfigProvider } from 'contexts/ConfigContext';

const DashboardLayout = () => {
  return (
    <ConfigProvider>
      <div
        style={{
          minHeight: '100%',
          width: '100%',
          margin: 0,
          padding: 0,
          overflowX: 'hidden',
          overflowY: 'visible',

          background: `
            radial-gradient(circle at top left, #4f46e5 0, #020617 45%),
            radial-gradient(circle at bottom right, #0f766e 0, #020617 50%)
          `,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <main
          style={{
            minHeight: 'auto',
            width: '100%',
            margin: 0,
            padding: 0
          }}
        >
          <Outlet />
        </main>
      </div>
    </ConfigProvider>
  );
};

export default DashboardLayout;