import React from 'react';
import Bar from '../container_comp/Bar';
import { ButtonStyle, ConStyle, ConType, InputStyle, InputType, Size } from '../helpers/compInterface';
import LINKS from './Links';
import Cart from '../container_comp/Cart';
import Container from '../container_comp/Container';
import USER from '../user_comp/User';
import ProductInput from '../input_comp/ProductInput';

const NAVIGATOR = () => {
    return (
        <>
            <Container style={ConStyle.FRONT}>
                <Bar
                    type={ConType.NAV}
                    size={Size.MAX}
                >
                    <ProductInput
                        type={InputType.TEXT}
                        placeholder={'search...'}
                        size={Size.MAX}
                        style={InputStyle.SEARCH}
                    />
                    <LINKS />
                    <p></p>
                    <p></p>
                    <p></p>
                    <p></p>
                    <p></p>
                    <p></p>
                    <USER style={ButtonStyle.BUBBLE} />
                    <p></p>
                    <p></p>
                    <Cart style={ButtonStyle.PORT}>
                        <p>cart</p>
                    </Cart>
                </Bar>
            </Container>
        </>
    );
}

export default NAVIGATOR;