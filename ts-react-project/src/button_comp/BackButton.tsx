import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IButton } from '../button_comp/Button'; 
import { ButtonStyle, Size } from '../helpers/compInterface';

const BackButton: React.FC<IButton> = ({ style = ButtonStyle.BUBBLE, size = Size.ONE,  action, children }) => {
    const navigate = useNavigate();
    const classNames = `${style}-button back-button ${size}`;

    const handleAction = () => {
        navigate(-1); 
        if(action){
            action();
        }
    };

    return (
        <button
            className={classNames}
            onClick={handleAction} 
        >
            {children}
        </button>
    );
};

export default BackButton;
