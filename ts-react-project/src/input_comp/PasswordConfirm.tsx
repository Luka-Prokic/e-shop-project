import React, { useState } from 'react';
import { InputStyle, InputType, Size } from '../helpers/compInterface';
import './Inputs.css';
import Input, { IInput } from './Input';

interface IPasswordConfirmInput extends IInput {
    confirmPlaceholder?: string;
    confirmValue?: string;
    confirmName?: string;
    confirmId?: string;
    onConfirmChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    styleFirst?: InputStyle;
    styleSecond?: InputStyle;
    passwordRef?: React.RefObject<HTMLInputElement>;
    confirmPasswordRef?: React.RefObject<HTMLInputElement>;
}

const PasswordConfirmInput: React.FC<IPasswordConfirmInput> = ({
    styleFirst = InputStyle.MIN,
    styleSecond = InputStyle.MIN,
    size = Size.LARGE,
    placeholder,
    confirmPlaceholder,
    value,
    confirmValue,
    onChange,
    onConfirmChange,
    required,
    id,
    confirmId,
    name,
    confirmName,
    defValue,
    passwordRef,
    confirmPasswordRef,
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
                ref={passwordRef}
                style={styleFirst}
                size={size}
                required={required}
                defValue={defValue}
            />
            <Input
                type={showPassword ? InputType.TEXT : InputType.PASSWORD}
                placeholder={confirmPlaceholder}
                value={confirmValue}
                onChange={onConfirmChange}
                id={confirmId}
                name={confirmName}
                ref={confirmPasswordRef}
                style={styleSecond}
                size={size}
                required={required}
                defValue={defValue}
            />
            <label className="label-password-checkbox">
                <input
                    className="show-password-checkbox"
                    type="checkbox"
                    checked={showPassword}
                    onChange={handleCheckboxChange}
                />
                <span className="custom-checkmark"></span>
                <p>Show password</p>
            </label>
        </>
    );
};

export default PasswordConfirmInput;