import Button from '../button_comp/Button';
import { ButtonStyle, ButtonType, Size } from '../helpers/compInterface';
import React from 'react';

const LINKS = () => {
    return (
        <>
            <Button style={ButtonStyle.BUBBLE} size={Size.MAX} link={"/"} type={ButtonType.TOGGLE}>Home</Button>
            <Button style={ButtonStyle.BUBBLE} size={Size.MAX} link={"/shop"} type={ButtonType.TOGGLE}>Shop</Button>
            <Button style={ButtonStyle.BUBBLE} size={Size.MAX} link={"/aboutus"} type={ButtonType.TOGGLE}>Info</Button>
        </>
    );
}

export default LINKS;