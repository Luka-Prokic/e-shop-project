import { useContext, useEffect, useState } from 'react';
import { ConStyle, ConType, ImageStyle, PriceType, Size } from '../helpers/compInterface';
import '../container_comp/Container.css';
import { CardContextState, ShopContext } from '../helpers/AppContext';
import Container, { ICon } from '../container_comp/Container';
import React from 'react';
import './ProductPage.css';
import Price from '../text_comp/Price';
import ImagE from '../image_comp/Image';
import Buy from '../button_comp/Buy';

export interface IPage extends ICon {
    product?: any;
    page?: number;
}

const ProductPage: React.FC<IPage> = ({ style = "product", size = Size.FULLSCREEN, type, product = null }) => {
    const [initialWidth, setInitialWidth] = useState<number | undefined>(undefined);
    const containerStyle = initialWidth ? { width: `${initialWidth}px` } : {};
    const shopContext = useContext(ShopContext);
    const [state, setState] = useState<CardContextState>({
        card: { id: product.card.id, quantity: product.card.quantity, price: product.card.price, discount: product.card.discount },
    });


    useEffect(() => {
        const handleResize = () => {
            if (size === Size.FULLSCREEN) {
                setInitialWidth(window.innerWidth);
            }
        };

        handleResize();
    }, [initialWidth, size]);

    const updateQuantity = (newCount: number) => {
        shopContext?.updateCart(state.card.id, newCount);
        setState(prevState => ({
            ...prevState,
            card: {
                ...prevState.card,
                quantity: newCount,
            }
        }));
    };

    useEffect(() => {
        const cartProduct = shopContext?.state.cart.find(cartItem => cartItem.card.id === state.card.id);
        const cartQuantity = cartProduct ? cartProduct : state;
        if (cartQuantity.card.quantity !== state.card.quantity) {
            updateQuantity(cartQuantity.card.quantity);
        }
    }, [shopContext?.state.cart, state.card.quantity])

    useEffect(() => {
        if (state.card.quantity > 0) {
            shopContext?.addToCart(state);
        } else {
            shopContext?.removeFromCart(state.card.id);
        }
    }, [state.card.quantity]);

    return (<>
        <section className={`${style}-page ${type} ${size}`} style={containerStyle}>
            <div className="image">
                <ImagE src={product.image} style={ImageStyle.PRODUCT} size={Size.LARGE} />
            </div>
            <div className="content">
            </div>
            <Container style={ConStyle.GHOST} size={Size.SMALL} type={ConType.RELATIVE}>
                <b className="name">
                    {product.name}
                </b>
                <div className="price">
                    <Price price={state.card.price} discount={state.card.discount} size={Size.MAX} currency={PriceType.DINAR} />
                </div>
                <div className="buy">
                    <Buy
                        count={state.card.quantity}
                        onCountChange={updateQuantity}
                        size={Size.MAX} >ADD</Buy>
                </div>
                <p className="description">
                    {product.description}
                </p>
            </Container>
        </section>
    </>
    );
};

export default ProductPage;