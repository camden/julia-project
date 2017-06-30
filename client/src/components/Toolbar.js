import React from 'react';
import logo from '../assets/oktalogo.png';

const Toolbar = ({ children }) => {
  return (
    <div className='toolbar'>
    <img src={logo} className='logo'/>  <div className='toolbar-content'>
        { children }
      </div>
    </div>
  );
}

export default Toolbar;
