import { ConStyle, ConType, Size } from '../helpers/compInterface';
import { ICon } from './Container';
import './Container.css';
import React from 'react';

const Field: React.FC<ICon> = ({ style = ConStyle.RELATIVE, size = Size.MAX, type = ConType.FC, children}) => {
    const classNames = `${style}-bar ${type} ${size}`;
  
    return <form 
        className={classNames}
        >
      {children}
    </form>
  }

export default Field;