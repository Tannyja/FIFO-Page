import NavItem from '../NavItem';

const NavGroup = ({ item }) => {
    return (
        <div style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 600, padding: '8px 16px' }}>{item.title}</div>

            {item.children?.map((child, index) => (
                <NavItem key={index} item={child} />
            ))}
        </div>
    );
};

export default NavGroup;
