import React, { useEffect, useState } from 'react';
import { InputStyle, InputType } from '../helpers/compInterface';
import './CountryInput.css';
import { IInput } from './Input';

const CountryInput: React.FC<IInput> = ({
    style = InputStyle.BUBBLE,
    size,
    type,
    placeholder,
    value,
    onChange,
    onBlur,
    required,
    id,
    name,
    ref,
}) => {
    const [countries, setCountries] = useState<string[]>([]);
    const [foundCountries, setFoundCountries] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState(value || '');
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);

    useEffect(() => {
        fetch('https://restcountries.com/v3.1/all')
            .then((response) => response.json())
            .then((data) => {
                const countryNames = data.map((country: any) => country.name.common);
                setCountries(countryNames);
            })
            .catch((error) => console.error('Error:', error));
    }, []);

    const handleMouseEnter = (index: number) => {
        setSelectedIndex(index);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setInputValue(input);
        if (onChange) onChange(event);

        const found = countries
            .filter((country) =>
                country.toLowerCase().startsWith(input.toLowerCase())
            )
            .slice(0, 4);
        setFoundCountries(found);

        if (found.length > 0) {
            setSelectedIndex(0);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowDown') {
            if (selectedIndex < foundCountries.length - 1) {
                setSelectedIndex(selectedIndex + 1);
            }
        }

        if (event.key === 'ArrowUp') {
            if (selectedIndex > 0) {
                setSelectedIndex(selectedIndex - 1);
            }
        }

        if (event.key === 'Enter' && selectedIndex >= 0) {
            const selectedCountry = foundCountries[selectedIndex];
            setInputValue(selectedCountry);
            if (onChange) onChange({ target: { value: selectedCountry } } as React.ChangeEvent<HTMLInputElement>);
            setFoundCountries([]);
        }

        if (event.key === 'Escape') {
            setFoundCountries([]);
        }
    };

    const handleSuggestionClick = (country: string) => {
        setInputValue(country);
        if (onChange) onChange({ target: { value: country } } as React.ChangeEvent<HTMLInputElement>);
        setFoundCountries([]);
    };

    const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {

        if (onBlur) onBlur(event);
        setTimeout(() => setFoundCountries([]), 200);
    };

    useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    return (
        <>
            <label className={`floating-label ${size}`}>
                <input
                    className={`${style}-input ${type} max`}
                    type={type}
                    placeholder=" "
                    value={inputValue}
                    onChange={handleInputChange}
                    readOnly={type === InputType.READONLY}
                    ref={ref}
                    autoComplete="off"
                    id={id}
                    name={name}
                    required={required}
                    onKeyDown={handleKeyDown}
                    onBlur={handleInputBlur}
                    onFocus={handleInputChange}
                />
                <span>{placeholder}</span>
                <ul className={inputValue && foundCountries.length > 0 ? 'country-list' : 'country-list-hidden'}>
                    {foundCountries.map((country, index) => (
                        <li
                            key={index}
                            className={`country-element ${index === selectedIndex ? 'selected' : ''}`}
                            onClick={() => handleSuggestionClick(country)}
                            onMouseEnter={() => handleMouseEnter(index)}
                        >
                            {country}
                        </li>
                    ))}
                </ul>
            </label>
        </>
    );
};

export default CountryInput;