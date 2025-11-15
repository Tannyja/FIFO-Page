import { useContext } from 'react';

// material-ui
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';

// project
import { ConfigContext } from 'contexts/ConfigContext';
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from 'config';

// drawer content
import DrawerContent from './DrawerContent';

export default function MainDrawer() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const { state, setState } = useContext(ConfigContext);

  const drawerOpen = state.opened;

  const handleDrawerToggle = () => {
    setState({ ...state, opened: !drawerOpen });
  };

  return (
    <>
      {/* Desktop Drawer */}
      {!downLG ? (
        <Drawer
          variant="persistent"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          sx={{
            width: drawerOpen ? DRAWER_WIDTH : MINI_DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerOpen ? DRAWER_WIDTH : MINI_DRAWER_WIDTH,
              transition: '0.3s ease'
            }
          }}
        >
          <DrawerContent />
        </Drawer>
      ) : (
        /* Mobile */
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH
            }
          }}
        >
          <DrawerContent />
        </Drawer>
      )}
    </>
  );
}
