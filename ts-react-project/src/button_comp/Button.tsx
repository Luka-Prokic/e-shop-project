import React, { useEffect, useState } from 'react';
import './Button.css';
import { ButtonStyle, ButtonType, ExcludeFullscreen, Size } from '../helpers/compInterface';
import { useNavigate, useLocation } from 'react-router-dom';

export interface IButton {
    style?: ButtonStyle;
    size?: ExcludeFullscreen<Size>;
    type?: ButtonType;
    link?: string;
    action?: () => void;
    onMouseDown?: () => void;
    children?: React.ReactNode;
    titleCustom?: string;
    toggled?: boolean;
    freeze?: boolean;
    ref?: React.Ref<HTMLButtonElement>;
}

const Button = React.forwardRef<HTMLButtonElement, IButton>(
    (
        {
            style = 'port',
            size = 'm',
            type = ButtonType.CLICK,
            link,
            action,
            onMouseDown,
            titleCustom,
            children,
            toggled,
            freeze = false,
        },
        ref
    ) => {
        const [isToggled, setIsToggled] = useState<boolean>(() => {
            return link ? sessionStorage.getItem(link) === 'true' : false;
        });

        const classNames =` ${ style }-button ${ size } ${ (isToggled || toggled || freeze) ? 'toggled' : '' }`;
        const navigate = useNavigate();
        const location = useLocation();

        const handleClick = () => {
            if (freeze) return;

            if (link) {
                if (type === 'toggle') {
                    const newToggledState = !isToggled;
                    setIsToggled(newToggledState);
                    sessionStorage.setItem('togglePage', newToggledState ? link : '');
                    navigate(newToggledState ? link : '/');
                } else {
                    navigate(link);
                }
            } else if (type === 'toggle') {
                setIsToggled((prev) => !prev);
            }

            if (action) action();
        };

        useEffect(() => {
            setIsToggled(location.pathname === link);
        }, [location.pathname]);

        if (freeze)
            return (
                <button
                    className={classNames}
                    onClick={(e) => {
                        e.currentTarget.blur();
                        handleClick();
                    }}
                    onMouseDown={onMouseDown}
                    disabled
                    title-custom={titleCustom}
                    ref={ref}
                >
                    {children}
                </button >
            );

        return (
            <button
                className={classNames}
                onClick={(e) => {
                    e.currentTarget.blur();
                    handleClick();
                }}
                onMouseDown={onMouseDown}
                title-custom={titleCustom}
                ref={ref}
            >
                {children}
            </button >
        );
    });
export default Button;