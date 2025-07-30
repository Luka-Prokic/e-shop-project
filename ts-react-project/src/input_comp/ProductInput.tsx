import React, { forwardRef, useContext, useEffect, useState } from 'react';
import { ButtonStyle, InputStyle, InputType, Size } from '../helpers/compInterface';
import './ProductInput.css';
import { IInput } from './Input';
import { ShopContext } from '../helpers/AppContext';
import ImagE from '../image_comp/Image';
import { useNavigate } from 'react-router-dom';
import Button from '../button_comp/Button';
import { Product } from '../helpers/Products';

const ProductInput = forwardRef<HTMLInputElement, IInput>(({
    style = InputStyle.SEARCH,
    size,
    type,
    placeholder,
    value,
    onChange,
    required,
    id,
    name
}, ref) => {

    const inputRef = React.useRef<HTMLInputElement>(null);
    const [foundProducts, setFoundProducts] = useState<typeof products>([]);
    const [searhHistory, setSearhHistory] = useState<Product[]>(() => {
        const storedHistory = sessionStorage.getItem('searchHistory');
        return storedHistory ? JSON.parse(storedHistory) : [];
    });
    const [inputValue, setInputValue] = useState<string>(value || '');
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [showFoundProducts, setShowFoundProducts] = useState<boolean>(false);
    const [mouseEntered, setMouseEntered] = useState<boolean>(false);
    const shopContext = useContext(ShopContext);
    const products = shopContext?.state.products || [];
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.setItem('searchHistory', JSON.stringify(searhHistory));
    }, [searhHistory]);

    const handleMouseEnter = (index: number) => {
        if (index !== selectedIndex)
            setMouseEntered(true);
        else
            setMouseEntered(false);

        setSelectedIndex(index);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setInputValue(input);
        setSelectedIndex(-1);

        if (onChange) onChange(event);

        if (input.trim() !== '') {
            const nameMatches = products
                .filter(product => product.name?.toLowerCase().startsWith(input.toLowerCase()));

            let combinedResults = nameMatches;

            if (nameMatches.length < 8) {
                const tagMatches = products
                    .filter(product =>
                        Array.isArray(product?.tags) &&
                        product?.tags.some(tag => tag.toLowerCase().includes(input.toLowerCase())) &&
                        !nameMatches.includes(product)
                    )
                    .slice(0, 8 - nameMatches.length);

                combinedResults = [...nameMatches, ...tagMatches];


                // if (combinedResults.length < 8) {
                //     const descriptionMatches = products
                //         .filter(
                //             product =>
                //                 product.description?.toLowerCase().includes(input.toLowerCase()) &&
                //                 !nameMatches.includes(product)
                //         )
                //         .slice(0, 8 - nameMatches.length);

                //     combinedResults = [...nameMatches, ...tagMatches, ...descriptionMatches];

                // }

            }

            setFoundProducts(combinedResults.slice(0, 8));


        } else {
            setFoundProducts([]);
        }
    };


    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
        }

        if (event.key === 'ArrowDown') {
            if (selectedIndex < foundProducts.length - 1 && foundProducts.length > 0) {
                setSelectedIndex(selectedIndex + 1);
            } else if (selectedIndex < searhHistory.length - 1 && foundProducts.length === 0) {
                setSelectedIndex(selectedIndex + 1);
            }
        }

        if (event.key === 'ArrowUp') {
            if (selectedIndex >= 0) {
                setSelectedIndex(selectedIndex - 1);
            }
        }

        if (event.key === 'Enter') {
            if (onChange) onChange({ target: { value: foundProducts[selectedIndex].name } } as React.ChangeEvent<HTMLInputElement>);
            navigateToProduct(foundProducts.length ? foundProducts[selectedIndex] : searhHistory[selectedIndex]);
        }

        if (event.key === 'Escape') {
            handleInputBlur();
        }
    };

    const handleSuggestionClick = (product: typeof products[0]) => {
        if (product) {
            if (onChange) onChange({ target: { value: product.name } } as React.ChangeEvent<HTMLInputElement>);
            navigateToProduct(product);
        }
    };

    const handleInputBlur = () => {
        setShowFoundProducts(false);
        setSelectedIndex(-1);
        setInputValue('');
        setFoundProducts([]);
        if (inputRef?.current) {
            inputRef.current.blur();
        }
    };

    const navigateToProduct = (product: typeof products[0]) => {

        if (selectedIndex !== -1) {
            navigate(`${product.image !== 'temp' ? '/' : '/search/'}${product.card.id}`);
            handleHistory(product);

        } else if (inputValue !== '') {
            navigate(`/search/${encodeURIComponent(inputValue)}`);
            handleHistory(product);
        }
        handleInputBlur();
    };

    const handleHistory = (product: typeof products[0]) => {
        if (product) {
            setSearhHistory((prevHistory) => {
                const filteredHistory = prevHistory.filter(item => item.card.id !== product.card.id);
                const newHistory = [product, ...filteredHistory];
                return newHistory.slice(0, 8);
            });
        } else {
            const temp = new Product(inputValue, inputValue, 'temp', inputValue, 0);
            setSearhHistory((prevHistory) => {
                const filteredHistory = prevHistory.filter(item => item.card.id !== temp.card.id);
                const newHistory = [temp, ...filteredHistory];
                return newHistory.slice(0, 8);
            });
        }
    };
    return (
        <>
            <label className={`floating-label ${size}`}>
                <input
                    className={`${style}-input${selectedIndex > -1 ? "" : "-selected"} ${type} max`}
                    type={type}
                    placeholder={" "}
                    value={inputValue}
                    onChange={handleInputChange}
                    readOnly={type === InputType.READONLY}
                    ref={inputRef}
                    autoComplete='off'
                    id={id}
                    name={name}
                    required={required}
                    onFocus={() => setShowFoundProducts(true)}
                    onBlur={() => setShowFoundProducts(false)}
                    onKeyDown={handleKeyDown}
                />
                {(inputRef.current === document.activeElement || !inputValue) && <span>search</span>}
                {showFoundProducts && <ul className={'product-list'} role="listbox" aria-labelledby={id}>
                    {foundProducts.length ? <>
                        {foundProducts.map((product, index) => (
                            <li
                                key={index}
                                className={`product-element ${index === selectedIndex ? 'selected' : ''}`}
                                role="option"
                                aria-selected={index === selectedIndex}
                                onMouseDown={() => handleSuggestionClick(product)}
                                onMouseEnter={() => handleMouseEnter(index)}
                                onMouseLeave={() => mouseEntered && handleMouseEnter(-1)}
                            >
                                <ImagE src={product.image} size={Size.SMALL}></ImagE>
                                {product.name}
                            </li>))}
                    </> : <>
                        {searhHistory.length ? <>
                            <>{inputValue && <li
                                className={'no-product-element'}
                            >
                                Nothing Found
                            </li>}</>
                            {searhHistory.map((product, index) => (
                                <li
                                    key={index}
                                    className={`product-history ${index === selectedIndex ? 'selected' : ''}`}
                                    role="option"
                                    aria-selected={index === selectedIndex}
                                    onMouseDown={() => handleSuggestionClick(product)}
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseLeave={() => mouseEntered && handleMouseEnter(-1)}
                                >
                                    {product.name}
                                    {product.image !== 'temp' ? <ImagE src={product.image} size={Size.SMALL}></ImagE> : <div style={{ width: '20%', aspectRatio: '1/1' }} />}
                                </li>)
                            )}
                            <li
                                className={`delete-history`}
                                role="option"
                                onMouseDown={() => setSearhHistory([])}
                            >
                                clear history
                                <div style={{ width: '20%', aspectRatio: '1/1' }} />
                            </li>
                        </> : <>{inputValue && <li
                            className={'no-product-element'}
                        >
                            Nothing Found
                        </li>}</>}
                    </>}
                </ul>}
                <Button size={Size.SMALL} style={ButtonStyle.BUBBLE} action={() => navigateToProduct(foundProducts[selectedIndex])}><b style={{ fontSize: '22px' }}>⌕</b></Button>
            </label >
        </>
    );
});

export default ProductInput;