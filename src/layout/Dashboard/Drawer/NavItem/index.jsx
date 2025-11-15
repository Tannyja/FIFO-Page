import { ListItemButton, ListItemText } from '@mui/material';

const NavItem = ({ item }) => {
    return (
        <ListItemButton component="a" href={item.url}>
            <ListItemText primary={item.title} />
        </ListItemButton>
    );
};

export default NavItem;
