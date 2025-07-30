import React, { useState, useEffect, useRef, useContext } from 'react';
import './SortByPicker.css';
import { IButton } from '../button_comp/Button';
import { ButtonStyle, Size } from '../helpers/compInterface';
import { SortByType, useLayout } from '../helpers/LayoutContext';
import { ShopContext } from './AppContext';

export interface ISortByPicker extends IButton { }

const SortByPicker: React.FC<ISortByPicker> = ({ style = ButtonStyle.BUBBLE, size = Size.SMALL }) => {
    const { sortBy, setSortBy, pickedTags, setPickedTags } = useLayout();
    const shopContext = useContext(ShopContext);
    const tags = shopContext?.state.tags || [];
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [showSortByTags, setShowSortByTags] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);

    const dropDownRef = useRef<HTMLButtonElement | null>(null);
    const tagRef = useRef<HTMLButtonElement | null>(null);

    const sortOptions = [
        { label: 'Price', value: SortByType.PRICE },
        { label: 'Alphabet', value: SortByType.ALPHA },
        { label: 'Trend', value: SortByType.TREND },
    ];

    useEffect(() => {
        if (!isDropdownOpen) {
            setSelectedIndex(selectedIndex);
        }
    }, [isDropdownOpen]);

    const handleSortTypeChange = (type: SortByType, index: number) => {
        setSortBy({ type, direction: sortBy.direction });
        setDropdownOpen(false);
        if (dropDownRef.current)
            dropDownRef.current.blur();
        setSelectedIndex(index);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter') {
            event.preventDefault();
        }

        if (event.key === 'ArrowDown') {
            if (selectedIndex < sortOptions.length - 1) {
                setSelectedIndex(selectedIndex + 1);
            }
        }

        if (event.key === 'ArrowUp') {
            if (selectedIndex > 0) {
                setSelectedIndex(selectedIndex - 1);
            }
        }

        if (event.key === 'Enter') {
            if (selectedIndex >= 0) {
                handleSortTypeChange(sortOptions[selectedIndex].value, selectedIndex);
            }
        }

        if (event.key === 'Escape') {
            setDropdownOpen(false);
            if (dropDownRef.current)
                dropDownRef.current.blur();
            setSelectedIndex(selectedIndex);
        }
    };

    const handleScroll = () => {
        const threshold = 80;
        if (window.scrollY > threshold) {
            setShowSortByTags(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const currentSortLabel = sortOptions.find(option => option.value === sortBy.type)?.label || 'Sort By';

    return (
        <div className="sortby-picker max" onKeyDown={handleKeyDown} tabIndex={0}>
            <button
                className={`${style}-button ${isDropdownOpen ? 'toggled' : ''} dropdown-toggle ${size}`}
                ref={dropDownRef}
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                title-custom='Sort by'
            >
                {currentSortLabel}
            </button>

            {isDropdownOpen && (
                <div className="dropdown-wrapper" onMouseLeave={() => {
                    setDropdownOpen(false);
                    if (dropDownRef.current)
                        dropDownRef.current.blur();
                    setSelectedIndex(selectedIndex);
                }}>
                    <ul className="dropdown-menu">
                        {sortOptions.map((option, index) => (
                            <li
                                key={option.value}
                                className={`dropdown-item  ${selectedIndex === index ? 'selected' : ''}`}
                                onClick={() => handleSortTypeChange(option.value, index)}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="sort-buttons">
                <button
                    className={`${style}-button ${sortBy.direction === 'asc' ? 'toggled' : ''} ${size}`}
                    onClick={() => setSortBy({ type: sortBy.type, direction: 'asc' })}
                    title-custom="Ascending"
                >
                    ▲
                </button>
                <button
                    className={`${style}-button ${sortBy.direction === 'desc' ? 'toggled' : ''} ${size}`}
                    onClick={() => setSortBy({ type: sortBy.type, direction: 'desc' })}
                    title-custom="Descending"
                >
                    ▼
                </button>
            </div>

            <div>

            </div>
            <button
                className={`${style}-button ${showSortByTags ? 'toggled' : ''} sort-tags${showSortByTags ? '-toggled' : ''} ${size}`}
                onClick={() => {
                    setShowSortByTags(!showSortByTags);
                    if (tagRef.current)
                        tagRef.current.blur();
                }}
                ref={tagRef}
                title-custom="Show by"
            >
                Tags <span>▼</span>
            </button>
            <div
                className='tags-list'
            >
                <div className="picked-tags-list">
                    {pickedTags.slice(0, 10).map((tag) => {
                        const isPicked = pickedTags.includes(tag);
                        return <div
                            key={tag}
                            className="sort-tag"
                            onClick={() => {
                                if (isPicked) {
                                    setPickedTags(pickedTags.filter((item) => item !== tag));
                                } else {
                                    setPickedTags([...pickedTags, tag]);
                                }
                            }}
                            title-custom="Remove"
                        >
                            #{tag}
                        </div>
                    })}

                    {pickedTags.length > 10 && <div
                        className="sort-tag"
                        onClick={() => setShowSortByTags(true)}
                        title-custom="Show all tags"
                    >
                        ...
                    </div>}
                    {pickedTags.length < 1 && <div
                        className="all-tag"
                    >
                        #ALL
                    </div>}
                </div>

                {showSortByTags && (
                    <div className="sort-tags-list">
                        {tags.map((tag) => {
                            const isPicked = pickedTags.includes(tag);
                            return (
                                <div
                                    key={tag}
                                    className="sort-tag"
                                    style={{
                                        backgroundColor: isPicked ? '#ccc' : '#eee'
                                    }}
                                    onClick={() => {
                                        if (isPicked) {
                                            setPickedTags(pickedTags.filter((item) => item !== tag));
                                        } else {
                                            setPickedTags([...pickedTags, tag]);
                                        }
                                    }}
                                    title-custom={isPicked ? 'Remove' : 'Add'}
                                >
                                    #{tag}
                                </div>
                            );
                        })}

                        {pickedTags.length > 0 && <div
                            key="removeAllTags"
                            className="remove-tag"
                            onClick={() => {
                                setPickedTags([]);
                            }}
                            title-custom="Remove all tags"
                        >
                            CLEAR
                        </div>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SortByPicker;