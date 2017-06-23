import React from 'react';
import { Link } from 'react-router-dom';

const ToolbarItem = ({ title, linksTo }) => {
  return (
    <Link className='toolbar-item' to={linksTo}>{title}</Link>
  );
} 

export default ToolbarItem;
