import React, { useState } from 'react';
import { ButtonStyle, ConStyle, ConType, InputStyle, InputType, Size } from '../helpers/compInterface';
import './FillOutPaymentPage.css';
import { IPage } from './ProductPage';
import Button from '../button_comp/Button';
import Container from '../container_comp/Container';
import { useUserContext } from '../user_comp/UserContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement } from '@stripe/react-stripe-js';
import Input from '../input_comp/Input';

const stripePromise = loadStripe('your-publishable-stripe-key');

const PaymentForm: React.FC = () => {
    const [cardOwnerName, setCardOwnerName] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const [paymentOption, setPaymentOption] = useState('Credit/Debit')

    return (
        <div className="payment-form l">

            <div className="payment-options max">
                {['Credit/Debit', 'PayPal', 'Google Pay', 'Apple Pay', 'On Delivery'].map((option, index) => {
                    return (
                        <Button
                            key={index}
                            style={ButtonStyle.BUBBLE}
                            toggled={option === paymentOption ? true : false}
                            size={Size.SMALL}
                            titleCustom={'click to choose ' + option}
                            action={() => setPaymentOption(option)}>
                            {option}
                        </Button>
                    );
                })}
            </div>

            {paymentOption === 'Credit/Debit' && <>
                <Input
                    id="card-owner-name"
                    type={InputType.TEXT}
                    placeholder="Cardholder's Name"
                    value={cardOwnerName}
                    size={Size.MAX}
                    onChange={(e) => setCardOwnerName(e.target.value)}
                    style={InputStyle.MIN}
                />
                <CardElement id="card-element" />
            </>}
            {/* <Container style={ConStyle.FRONT} size={Size.SIX} type={ConType.FC}>
                <Input
                    id="promo-code"
                    type={InputType.TEXT}
                    placeholder="Promo Code"
                    value={promoCode}
                    size={Size.LARGE}
                    onChange={(e) => setPromoCode(e.target.value)}
                    style={InputStyle.MIN}
                    titleCustom={'type your promo code here'}
                />
                <Button style={ButtonStyle.BUBBLE} size={Size.THREE}
                    titleCustom={"check if it's valid"} >
                    <b>CHECK</b>
                </Button>
            </Container> */}
        </div>
    );
};

const FillOutPaymentPage: React.FC<IPage> = ({ size = Size.FULLSCREEN, page }) => {
    const { setCheckoutPage, checkoutPage } = useUserContext();

    return (
        <section className={`payment-checkout-part ${size}`}>
            <Container style={ConStyle.GHOST} size={Size.LARGE} type={ConType.CHECKOUT}>
                {[3, 4].includes(checkoutPage) && <b>ENTER YOUR PAYMENT DETAILS :</b>}
                <Elements stripe={stripePromise}>
                    <PaymentForm />
                </Elements>
                {checkoutPage === 3 && <Container style={ConStyle.FRONT} size={Size.MAX} type={ConType.FC}>
                    <Button style={ButtonStyle.BUBBLE} size={Size.MAX} action={() => setCheckoutPage(page ? page - 1 : 1)}>
                        <b>PREV</b>
                    </Button>
                    <Button style={ButtonStyle.BUBBLE} size={Size.MAX} action={() => setCheckoutPage(page ? page + 1 : 1)}>
                        <b>NEXT</b>
                    </Button>
                </Container>}
            </Container>
        </section>
    );
};

export default FillOutPaymentPage;