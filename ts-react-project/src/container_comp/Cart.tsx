import React, { useContext, useEffect, useState } from 'react';
import './Cart.css';
import { ButtonStyle, InputType, Size, CardType, InputStyle, CardStyle, PriceStyle, PriceType } from '../helpers/compInterface';
import { ShopContext } from '../helpers/AppContext';
import Input from '../input_comp/Input';
import Button from '../button_comp/Button';
import { FakeProduct, Product } from '../helpers/Products';
import Card from '../card_comp/Card';
import { ICon } from './Container';
import Price from '../text_comp/Price';
import { useLocation } from 'react-router-dom';
import Loader from '../image_comp/Loader';

export interface ICart extends Omit<ICon, 'style'> {
  style?: ButtonStyle;
}
const Cart: React.FC<ICart> = ({ style = ButtonStyle.PORT, size = "se7en", children }) => {
  const [count, setCount] = useState(0);
  const [showModal, setModal] = useState(true);
  const [inputSize, setInputSize] = useState<Size.THREE | Size.NONE>(Size.NONE);
  const shopContext = useContext(ShopContext);
  const location = useLocation();
  const { sum, trueSum } = shopContext?.priceOfCart() || { sum: 0, trueSum: 0 };
  const products = shopContext?.state.products || [];

  const cartChangeMode = () => {
    if (showModal && count > 0) {
      setModal(false);
      setInputSize(Size.NONE);
    }
  };

  const cartMouseLeave = () => {
    if (!showModal) {
      setModal(true);
    }
    setTimeout(() => {
      setInputSize(count ? Size.THREE : Size.NONE);
    }, 200);
  };

  const productCount = () => {
    return shopContext?.state.cart.reduce((total, currentItem) => {
      return total + currentItem.card.quantity;
    }, 0) || 0;
  };

  useEffect(() => {
    const newCount = productCount();
    setCount(newCount);
  }, [shopContext]);

  useEffect(() => {
    if (count === 0) {
      setModal(true);
      setInputSize(Size.NONE);
    } else {
      if (showModal) setInputSize(Size.THREE);
    }
  }, [count]);

  useEffect(() => {
    if (location.pathname === '/checkout') {
      cartMouseLeave();
    }
  }, [location]);

  return (
    <>
      {location.pathname !== '/checkout' && (
        <div
          className={showModal ? `${style}-cart-button ${sum > 0 ? size : Size.NONE}` : `${style}-cart ${sum > 0 ? size : Size.NONE}`}
          onClick={cartChangeMode}
          onMouseLeave={cartMouseLeave}
          title-custom={showModal && 'your cart'}
        >
          {showModal ? (
            <>
              <Input
                size={inputSize}
                type={InputType.READONLY}
                value={String(count)}
                style={InputStyle.BUBBLE}
              />
              {children}
            </>
          ) : (
            <>
              <section>
                {shopContext?.state.cart.map((cartProduct) => {
                  const product = products.find(p => p.card.id === cartProduct.card.id);
                  if (product) {
                    const productFinal = new FakeProduct(
                      cartProduct.card.id,
                      product.image,
                      cartProduct.card.price,
                      cartProduct.card.discount,
                      cartProduct.card.quantity
                    );
                    return (
                      <Card
                        key={cartProduct.card.id}
                        product={productFinal}
                        style={CardStyle.GHOST}
                        type={CardType.CHECK}
                        size={Size.FULLSCREEN}
                        currency={PriceType.DINAR}
                      />
                    );
                  }
                })}
                {!products.length && (<Loader margin={'12px'} />)}
              </section>
              <div>
                <Price price={sum} sum={trueSum} style={PriceStyle.PORT} currency={PriceType.DINAR}/>
                <Button
                  style={ ButtonStyle.BUBBLE}
                  size={Size.LARGE}
                  action={cartMouseLeave}
                  link={"/checkout"}
                >
                  Checkout ({String(count)})
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Cart;