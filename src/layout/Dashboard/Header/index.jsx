import { useMemo, useContext } from 'react';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

// project imports
import AppBarStyled from './AppBarStyled';
import HeaderContent from './HeaderContent';
import IconButton from 'components/@extended/IconButton';

// context
import { ConfigContext } from 'contexts/ConfigContext';

// config
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from 'config';

// assets
import MenuFoldOutlined from '@ant-design/icons/MenuFoldOutlined';
import MenuUnfoldOutlined from '@ant-design/icons/MenuUnfoldOutlined';

export default function Header() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  // ใช้ config context ที่มีจริงในโปรเจกต์
  const { state, setState } = useContext(ConfigContext);

  // drawer toggle
  const drawerOpen = state.opened;
  const toggleDrawer = () => setState({ ...state, opened: !drawerOpen });

  const headerContent = useMemo(() => <HeaderContent />, []);

  const mainHeader = (
    <Toolbar>
      <IconButton
        aria-label="open drawer"
        onClick={toggleDrawer}
        edge="start"
        color="secondary"
        variant="light"
        sx={{
          color: 'text.primary',
          bgcolor: drawerOpen ? 'transparent' : 'grey.100',
          ml: { xs: 0, lg: -2 }
        }}
      >
        {!drawerOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </IconButton>

      {headerContent}
    </Toolbar>
  );

  const appBar = {
    position: 'fixed',
    color: 'inherit',
    elevation: 0,
    sx: {
      borderBottom: '1px solid',
      borderBottomColor: 'divider',
      zIndex: 1200,
      width: {
        xs: '100%',
        lg: drawerOpen
          ? `calc(100% - ${DRAWER_WIDTH}px)`
          : `calc(100% - ${MINI_DRAWER_WIDTH}px)`
      }
    }
  };

  return (
    <>
      {!downLG ? (
        <AppBarStyled open={drawerOpen} {...appBar}>
          {mainHeader}
        </AppBarStyled>
      ) : (
        <AppBar {...appBar}>{mainHeader}</AppBar>
      )}
    </>
  );
}
