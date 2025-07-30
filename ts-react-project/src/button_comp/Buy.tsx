import React, { useContext, useEffect, useState } from 'react';
import './Counter.css'
import { ButtonStyle, InputStyle, InputType, Size } from '../helpers/compInterface';
import Button from './Button';
import Input from '../input_comp/Input';
import { ShopContext } from '../helpers/AppContext';
import { ICounter } from './Counter';

const Buy: React.FC<ICounter> = ({ style = ButtonStyle.PORT, size = "max", children, count = 0, onCountChange }) => {
    let buyStyle = `${style}-buy ${size}`;
    let buySize = Size.NONE;
    let buyText = children ? children : '+';

    const [localCount, setLocalCount] = useState<number>(count);
    const shopContext = useContext(ShopContext);

    const handleIncrement = () => {
        setLocalCount(prev => prev + 1);
    };

    const handleDecrement = () => {
        setLocalCount(prev => (prev > 0 ? prev - 1 : 0));
    };

    useEffect(() => {
        if (typeof onCountChange === 'function') {
            onCountChange(localCount);
        }
    }, [localCount]);

    useEffect(() => {
        setLocalCount(count);
    }, [shopContext?.state.cart]);

    if (localCount === 0) {
        buyStyle = `${style}-buy ${size}`;
        buySize = Size.NONE;
        buyText = children ? children : '+';
    } else {
        buyStyle = `${style}-counter ${size}`;
        buySize = Size.MAX;
        buyText = '+';
    }

    return (<div
        className={buyStyle}
    >
        <Button
            size={buySize}
            style={style}
            action={() => handleDecrement()}
        >
            -
        </Button>
        <Input
            size={buySize}
            type={InputType.READONLY}
            value={String(localCount)}
            style={InputStyle.BUBBLE}
        />
        <Button
            size={Size.MAX}
            style={style}
            action={() => handleIncrement()}
        >
            {buyText}
        </Button>
    </div>)


}

export default Buy;