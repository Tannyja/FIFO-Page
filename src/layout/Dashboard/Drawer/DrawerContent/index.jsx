import { useContext } from "react";

// material-ui
import List from "@mui/material/List";

// project imports
import { ConfigContext } from "contexts/ConfigContext";

// menu items
import menuItems from "menu-items";

// NavItem (free version ใช้อันนี้)
import NavItem from "../NavItem";

const DrawerContent = () => {
  const { state } = useContext(ConfigContext); // กัน error เวลา header ใช้ drawer state

  return (
    <List
      component="nav"
      sx={{
        px: 1,
        mt: 2,
        overflowY: "auto",
      }}
    >
      {menuItems.items.map((item) => (
        <NavItem key={item.id} item={item} />
      ))}
    </List>
  );
};

export default DrawerContent;
