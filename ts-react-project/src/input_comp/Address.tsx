import React from 'react';
import { InputStyle, Size } from '../helpers/compInterface';
import './Inputs.css';

export interface IAddressInput {
    style?: InputStyle;
    size?: Size;
    placeholderCountry?: string;
    placeholderStreet?: string;
    placeholderHouseNumber?: string;
    required?: boolean;
    id?: string;
    nameCountry?: string;
    nameStreet?: string;
    nameHouseNumber?: string;
    country?: string;
    street?: string;
    houseNumber?: string;
    setCountry?: (value: string) => void;
    setStreet?: (value: string) => void;
    setHouseNumber?: (value: string) => void;
    children?: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
}

const AddressInput: React.FC<IAddressInput> = ({
    style = InputStyle.BUBBLE,
    size = Size.MAX,
    placeholderCountry = "Country",
    placeholderStreet = "Street",
    placeholderHouseNumber = "House Number",
    required,
    id,
    nameCountry,
    nameStreet,
    nameHouseNumber,
    country,
    street,
    houseNumber,
    setCountry,
    setStreet,
    setHouseNumber,
    children,
    ref
}) => {
    return (
        <div ref={ref}>
            <label className={`floating-label ${size}`}>
                <input
                    className={`${style}-input max`}
                    type="text"
                    placeholder=" "
                    name={nameCountry}
                    id={id ? `${id}-country` : undefined}
                    value={country}
                    onChange={(e) => setCountry?.(e.target.value)}
                    required={required}
                />
                <span>{placeholderCountry}</span>
            </label>
            <label className={`floating-label ${size}`}>
                <input
                    className={`${style}-input max`}
                    type="text"
                    placeholder=" "
                    name={nameStreet}
                    id={id ? `${id}-street` : undefined}
                    value={street}
                    onChange={(e) => setStreet?.(e.target.value)}
                    required={required}
                />
                <span>{placeholderStreet}</span>
            </label>
            <label className={`floating-label ${size}`}>
                <input
                    className={`${style}-input max`}
                    type="text"
                    placeholder=" "
                    name={nameHouseNumber}
                    id={id ? `${id}-house-number` : undefined}
                    value={houseNumber}
                    onChange={(e) => setHouseNumber?.(e.target.value)}
                    required={required}
                />
                <span>{placeholderHouseNumber}</span>
            </label>
            {children}
        </div>
    );
};

export default AddressInput;