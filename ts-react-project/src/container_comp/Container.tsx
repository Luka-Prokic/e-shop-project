import React, { useState, useEffect } from 'react';
import { ConStyle, ConType, Size } from '../helpers/compInterface';
import './Container.css';

export interface ICon {
    style?: ConStyle;
    size?: Size;
    type?: ConType;
    children?: React.ReactNode;
    titleCustom?: string;
}

const Container: React.FC<ICon> = ({ style = ConStyle.RELATIVE, size = Size.FULLSCREEN, type = ConType.FC, children, titleCustom }) => {
    const [initialWidth, setInitialWidth] = useState<number | undefined>(undefined);

    useEffect(() => {
        const handleResize = () => {
            if (size === Size.FULLSCREEN){
                setInitialWidth(window.innerWidth);
            }
        };

        handleResize();
    }, [initialWidth, size]);

    const containerStyle = initialWidth ? { width: `${initialWidth}px` } : {};
    const classNames = `${style}-bar ${type} ${size}`;

    return (
        <section 
        className={classNames} 
        style={size === Size.FULLSCREEN ? containerStyle : {}}
        title-custom={titleCustom}
        >
            {children}
        </section>
    );
};

export default Container;