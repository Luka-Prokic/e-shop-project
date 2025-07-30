import { ICon } from './Container';
import './Container.css';
import React from 'react';

  const Bar: React.FC<ICon> = ({ style, size, type, children}) => {
    const classNames = `${style}-bar ${type} ${size}`;
  
    return <nav 
        className={classNames}
        >
      {children}
    </nav>
  }

export default Bar;