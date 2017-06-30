import React from 'react';
import { NavLink as Link } from 'react-router-dom';

const ToolbarItem = ({ title, linksTo }) => {
  return (
    <Link 
      className='toolbar-item' 
      to={linksTo} 
      activeClassName='toolbar-item-selected'
      exact
    >
      {title}
    </Link>
  );
} 

export default ToolbarItem;
