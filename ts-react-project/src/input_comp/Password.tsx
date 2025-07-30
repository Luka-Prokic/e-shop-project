import React, { useState } from 'react';
import { InputStyle, InputType, Size } from '../helpers/compInterface';
import './Inputs.css';
import './Password.css';
import Input, { IInput } from './Input';

const PasswordInput: React.FC<IInput> = ({
    style = InputStyle.BUBBLE,
    size = Size.MAX,
    placeholder,
    value,
    onChange,
    required,
    id,
    name,
    defValue,
    ref,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleCheckboxChange = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <>
            <Input
                type={showPassword ? InputType.TEXT : InputType.PASSWORD}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                id={id}
                name={name}
                ref={ref}
                style={style}
                size={size}
                required={required}
                defValue={defValue}
            />
            <label className="label-password-checkbox">
                <input
                    onChange={handleCheckboxChange}
                    className="show-password-checkbox"
                    type="checkbox"
                    checked={showPassword}
                />
                <span className="custom-checkmark" />
                <p>Show password</p>
            </label>
        </>
    );
};

export default PasswordInput;