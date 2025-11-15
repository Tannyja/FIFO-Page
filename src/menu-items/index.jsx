import dashboard from './dashboard';
import pages from './page';
import utilities from './utilities';
import support from './support';
import fifo from './fifo';   // <<< ใส่เพิ่มตรงนี้

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, fifo, pages, utilities, support]  // <<< ใส่ fifo เข้า array
};

export default menuItems;
