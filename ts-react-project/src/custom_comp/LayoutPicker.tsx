import React from 'react';
import './LayoutPicker.css';
import { IButton } from '../button_comp/Button';
import { ButtonStyle, Size } from '../helpers/compInterface';
import { LayoutType, useLayout } from '../helpers/LayoutContext';

export interface ILayoutPicker extends IButton { }

const LayoutPicker: React.FC<ILayoutPicker> = ({ style = ButtonStyle.BUBBLE, size = Size.SMALL }) => {
  const { layout, setLayout } = useLayout();

  return (
    <div className={`layout-picker max`}>
      {[LayoutType.DEF, LayoutType.SEC, LayoutType.FIR].map((index) => (
        <button
          key={index}
          className={`${style}-button ${layout === index ? 'toggled' : ''} ${size}`}
          onClick={() => setLayout(index)}
          title-custom={index === LayoutType.DEF ? '4 in row' : index === LayoutType.SEC ? '5 in row' : '6 in row'}
        >
          {index === LayoutType.DEF && '▤'}
          {index === LayoutType.SEC && '▥'}
          {index === LayoutType.FIR && '▦'}
        </button>
      ))
      }
    </div >
  );
};

export default LayoutPicker;