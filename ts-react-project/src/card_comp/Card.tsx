import React, { Children, ReactElement, useContext, useState, useEffect } from 'react';
import { ButtonStyle, CardStyle, CardType, PriceStyle, PriceType, Size } from '../helpers/compInterface';
import './Card.css';
import { ShopContext } from '../helpers/AppContext';
import Counter, { ICounter } from '../button_comp/Counter';
import Price from '../text_comp/Price';
import ImagE from '../image_comp/Image';

export interface ICard {
    style?: CardStyle;
    size?: Size;
    type?: CardType;
    children?: React.ReactNode;
    product?: any;
    currency?: PriceType;
}

const Card: React.FC<ICard> = ({ style = CardStyle.GHOST, size = Size.SMALL, type = CardType.SHOP, children, product = null, currency }) => {
    const classNames = `${style}-card ${type} ${size}`;
    const elements = Children.toArray(children);
    const shopContext = useContext(ShopContext);

    const [state, setState] = useState<any>(product);

    const updateQuantity = (newCount: number) => {
        if (product?.card.id) {
            shopContext?.updateCart(product.card.id, newCount);
            setState(prevState => ({
                ...prevState,
                card: {
                    ...prevState.card,
                    quantity: newCount,
                }
            }));
        }
    };

    useEffect(() => {
        const cartProduct = shopContext?.state.cart.find(cartItem => cartItem.card.id === state.card.id);
        const cartQuantity = cartProduct && (cartProduct.card.id !== '') ? cartProduct.card.quantity : state.card.quantity;

        if (cartQuantity !== state.card.quantity) {
            updateQuantity(cartQuantity);
        }
    }, [shopContext?.state.cart, state.card.quantity]);

    useEffect(() => {
        if (state.card.quantity > 0) {
            shopContext?.addToCart(state);
        } else {
            shopContext?.removeFromCart(state.card.id);
        }
    }, [state.card.quantity]);

    if (!product || !product.card) {
        return null;
    }

    return (
        <section className={classNames}
        >
            {(type === CardType.CHECK) ? (
                <>
                    <div className="buy">
                        <Counter
                            style={ButtonStyle.PORT}
                            count={state.card.quantity}
                            onCountChange={updateQuantity}
                        />
                    </div>
                    <a href={`/${product.card.id}`} className="image"
                        title-custom={'click for more info'}
                    >
                        <ImagE alt="ERROR" src={product.image} />
                    </a>
                    <div className="price"
                        title-custom={product.card.discount ? '-' + product.card.discount + '%' : 'no discount'}
                    >
                        <Price
                            price={product.card.price}
                            discount={product.card.discount}
                            style={PriceStyle.PORT}
                            currency={currency}
                        />
                        {children}
                    </div>
                </>
            ) : (
                <>
                    <a href={`/${product.card.id}`} className="image"
                        title-custom={'click for more about ' + product.name}
                    >
                        <ImagE alt="ERROR" src={product.image} />
                    </a>
                    <div className="content"
                    >
                        {elements[1]}
                    </div>
                    <div className="buy">
                        {React.cloneElement(elements[0] as ReactElement<ICounter>, {
                            count: state.card.quantity,
                            onCountChange: updateQuantity,
                        })}
                    </div>
                    <div className="price"
                        title-custom={product.card.discount ? '-' + product.card.discount + '%' : 'no discount'}
                    >
                        <Price
                            price={product.card.price}
                            discount={product.card.discount}
                            style={PriceStyle.PORT}
                            currency={currency}
                        />
                    </div>
                </>
            )}
        </section>
    );
};

export default Card;