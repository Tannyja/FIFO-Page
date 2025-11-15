import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// ---- Pages ----

// Dashboard หน้าหลัก path = src/pages/dashboard/default/index.jsx
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

// FIFO ที่มึงสร้าง
import FIFOPage from 'pages/fifo/FIFOPage';

// ---- Router Object ----

const MainRoutes = {
    path: '/',
    element: <DashboardLayout />,
    children: [
        // 👇 ตัวนี้เพิ่มเข้ามาให้ default redirect ไป /fifo
        {
            path: '',
            element: <Navigate to="/fifo" replace />
        },
        {
            path: 'dashboard',
            element: <DashboardDefault />
        },
        {
            path: 'fifo',
            element: <FIFOPage />
        }
    ]
};

export default MainRoutes;
