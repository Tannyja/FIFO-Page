import { createBrowserRouter } from 'react-router-dom';

// ---- IMPORT ROUTE CONFIG ----
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';

// ---- CREATE ROUTER ----
const router = createBrowserRouter(
    [
        MainRoutes,
        LoginRoutes
    ],
    {
        basename: import.meta.env.VITE_APP_BASE_NAME
    }
);

export default router;
