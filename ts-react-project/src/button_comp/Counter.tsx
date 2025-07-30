import React, { useContext, useEffect, useState } from 'react';
import './Counter.css'
import { ButtonStyle, InputStyle, InputType, Size } from '../helpers/compInterface';
import Button, { IButton } from './Button';
import Input from '../input_comp/Input';
import { ShopContext } from '../helpers/AppContext';

export interface ICounter extends IButton {
    count?: number;
    onCountChange?: (number: number) => void;
}

const Counter: React.FC<ICounter> = ({ style = ButtonStyle.PORT, size, count = 0, onCountChange }) => {
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

    return <div
        className={`${style}-counter ${size}`}
    >
        <Button
            size={Size.MAX}
            style={style}
            action={() => handleDecrement()}
        >
            -
        </Button>
        <Input
            size={Size.MAX}
            type={InputType.READONLY}
            value={String(localCount)}
            style={InputStyle.BUBBLE}
        />
        <Button
            size={Size.MAX}
            style={style}
            action={() => handleIncrement()}
        >
            +
        </Button>
    </div>
}

export default Counter;