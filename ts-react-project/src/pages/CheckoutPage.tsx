import React, { useContext, useEffect, useState } from 'react';
import { ButtonStyle, CardType, ConStyle, ConType, PriceType, Size } from '../helpers/compInterface';
import { ShopContext } from '../helpers/AppContext';
import Container from '../container_comp/Container';
import Button from '../button_comp/Button';
import Card from '../card_comp/Card';
import Price from '../text_comp/Price';
import BackButton from '../button_comp/BackButton';
import Loader from '../image_comp/Loader';
import { FakeProduct, Product } from '../helpers/Products';
import './CheckoutPage.css';
import { IPage } from './ProductPage';
import USER from '../user_comp/User';
import FillOutAddressPage from './FillOutAddressPage';
import FillOutPaymentPage from './FillOutPaymentPage';
import { useUserContext } from '../user_comp/UserContext';
import FillOutPersonalInfo from './FillOutPersonalInfo';
import FillOutUser from './FillOutUser';
import useVisible from '../helpers/AmIVisible';

const CheckoutPage: React.FC<IPage> = ({ style = "checkout", size = Size.FULLSCREEN, type }) => {
    const [initialWidth, setInitialWidth] = useState<number | undefined>(undefined);
    const containerStyle = initialWidth ? { width: `${initialWidth}px` } : {};
    const shopContext = useContext(ShopContext);
    const products = shopContext?.state.products || [];
    const cart = shopContext?.state.cart || [];
    const { sum, trueSum } = shopContext?.priceOfCart() || { sum: 0, trueSum: 0 };
    const { checkoutPage, setCheckoutPage, isLoggedIn, refreshUserInfo, user } = useUserContext();

    const [isVisible, ref] = useVisible<HTMLButtonElement>();

    useEffect(() => {
        const handleResize = () => {
            if (size === Size.FULLSCREEN) {
                setInitialWidth(window.innerWidth);
            }
        };

        handleResize();
    }, [initialWidth, size]);

    const handleDrag = (event: React.MouseEvent<HTMLDivElement>, productId: string) => {
        const productElement = event.currentTarget;
        const startX = event.clientX;
        let currentX = startX;


        const onMouseMove = (e: MouseEvent) => {
            productElement.classList.add('dragging');
            currentX = e.clientX;
            const deltaX = currentX - startX;
            productElement.style.transform = `translateX(${deltaX}px)`;

            const threshold = productElement.offsetWidth * 0.4;

            if (Math.abs(deltaX) > threshold) {
                productElement.classList.add('removing');
                productElement.classList.remove('dragging');

                setTimeout(() => {
                    const otherProducts = document.querySelectorAll('.checkout-page>.list>div:not(.removing)');
                    otherProducts.forEach(product => {
                        (product as HTMLElement).style.transform = 'translateY(-20px)';
                        setTimeout(() => {
                            (product as HTMLElement).style.transform = 'translateY(0)';
                        }, 10);
                    });
                    shopContext?.removeFromCart(productId);
                }, 300);
                document.removeEventListener('mousemove', onMouseMove);
            }
        };

        const onMouseUp = () => {
            if (!productElement.classList.contains('removing')) {
                productElement.style.transform = 'translateX(0)';
            }
            document.removeEventListener('mousemove', onMouseMove);
            productElement.classList.remove('dragging');
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp, { once: true });
    };

    useEffect(() => {
        let element
        if (checkoutPage === 1) {
            element = document.querySelector(".list-checkout-part");
            refreshUserInfo();
        } else if (checkoutPage === 2) {
            element = document.querySelector(".address-checkout-part");
        } else if (checkoutPage === 3) {
            element = document.querySelector(".payment-checkout-part");
        } else if (checkoutPage === 4) {
            element = document.querySelector(".personal-checkout-part");
        }
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, [checkoutPage]);

    return (
        <>
            {isLoggedIn ? (
                <b className="logged-status-positive">logged in</b>

            ) : (
                <div className="logged-status-negative">
                    <b>not logged in </b>
                    <USER style={ButtonStyle.TEXT} />
                </div>
            )}
            <section className={`${style}-page ${type}`} style={containerStyle}>
                <BackButton action={() => setCheckoutPage(1)}>
                    <b>BACK</b>
                </BackButton>
                <div className={`list-checkout-part ${checkoutPage === 1 ? Size.MAX : Size.FOUR}`}>
                    {cart.length ? (
                        <>
                            <b>YOUR CART :</b>
                            <Container size={checkoutPage < 2 ? Size.MEDIUM : Size.LARGE} type={ConType.LIST} titleCustom='drag to remove'>
                                {cart.map((cartProduct) => {
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
                                            <div
                                                key={cartProduct.card.id}
                                                onMouseDown={(event) => handleDrag(event, cartProduct.card.id)}
                                            >
                                                <Card
                                                    product={productFinal}
                                                    type={CardType.CHECK}
                                                    size={Size.MAX}
                                                    currency={PriceType.DINAR}
                                                >
                                                    <Price
                                                        discount={cartProduct.card.discount}
                                                        price={cartProduct.card.quantity * cartProduct.card.price}
                                                        currency={PriceType.DINAR}
                                                        size={checkoutPage === 1 ? Size.MAX : Size.NONE}
                                                    />
                                                </Card>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </Container>
                            {!products.length && <Loader margin={'12px'} />}
                            <Container size={checkoutPage === 1 ? Size.MEDIUM : Size.MAX}>
                                <Price price={sum} sum={trueSum} size={checkoutPage === 1 ? Size.MEDIUM : Size.MAX} currency={PriceType.DINAR} />
                                {<Button
                                    ref={checkoutPage === 1 ? ref : null}
                                    style={ButtonStyle.BUBBLE} size={checkoutPage === 1 ? Size.MEDIUM : Size.NONE} action={() => setCheckoutPage(2)}>
                                    <b>NEXT</b>
                                </Button>}
                            </Container>
                        </>
                    ) : (
                        <b>Your cart is empty.</b>
                    )}

                    {[3, 4, 5].includes(checkoutPage) && <Container size={Size.MAX} />}

                    {[4, 5].includes(checkoutPage) && user?.email && <FillOutUser size={Size.MAX} />}
                </div>

                {[2, 3, 4, 5].includes(checkoutPage) && <Container size={Size.SIX} type={ConType.FLEXLIST}>
                    {[2, 3, 4, 5].includes(checkoutPage) && <FillOutAddressPage size={Size.MAX} page={2} />}
                    {[3, 4, 5].includes(checkoutPage) && <FillOutPaymentPage size={Size.MAX} page={3} />}
                    {[4, 5].includes(checkoutPage) && <FillOutPersonalInfo size={Size.MAX} page={4} />}
                </Container>}
            </section>
        </>
    );
};

export default CheckoutPage;