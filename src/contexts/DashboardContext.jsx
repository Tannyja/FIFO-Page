import { createContext, useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

// ==============================|| DASHBOARD CONTEXT ||============================== //

const DashboardContext = createContext(undefined);

export const DashboardProvider = ({ children }) => {
    const [isDashboardDrawerOpened, setDashboardDrawerOpened] = useState(false);

    const toggleDashboardDrawer = () => {
        setDashboardDrawerOpened((prev) => !prev);
    };

    const value = useMemo(
        () => ({
            isDashboardDrawerOpened,
            toggleDashboardDrawer
        }),
        [isDashboardDrawerOpened]
    );

    return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

DashboardProvider.propTypes = { children: PropTypes.node };

export const useDashboard = () => useContext(DashboardContext);
