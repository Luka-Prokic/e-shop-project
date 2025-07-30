import React, { useState } from 'react';
import { ImageStyle, ImageType, InputStyle, Size } from '../helpers/compInterface';
import './Inputs.css';
import './CardNumber.css';
import ImagE from '../image_comp/Image';
import Input from './Input';

export enum CreditType {
  VisaCard = "Visa",
  MasterCard = "MasterCard",
  DinersClub = "Diners Club"
}

const CreditCard: React.FC<{
  style?: InputStyle;
  size?: string;
  value?: string;
  placeholder?: string;
}> = ({
  style = InputStyle.BUBBLE,
  size,
  value = '',
  placeholder = 'xxxx xxxx xxxx xxxx'
}) => {
    const [card, setCard] = useState<string>(value);
    const [isValid, setIsValid] = useState<boolean>(true);
    const [showFullCard, setShowFullCard] = useState<boolean>(true);
    const [cardType, setCardType] = useState<CreditType | null>(null);

    const isValidCardNumber = (cardNumber: string) => {
      const digits = cardNumber.replace(/\s/g, '').split('').reverse().map(Number);
      return digits.reduce((sum, digit, index) => {
        if (index % 2 !== 0) {
          const doubled = digit * 2;
          return sum + (doubled > 9 ? doubled - 9 : doubled);
        }
        return sum + digit;
      }, 0) % 10 === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value.replace(/\D/g, '');
      const formattedCard = input.match(/.{1,4}/g)?.join(' ') || '';
      setCard(formattedCard);

      if (input.length === 0) setCardType(null);

      if (input.length === 1) {
        if (input.startsWith('4')) {
          setCardType(CreditType.VisaCard);
        } else if (input.startsWith('5')) {
          setCardType(CreditType.MasterCard);
        } else if (input.startsWith('6')) {
          setCardType(CreditType.DinersClub);
        } else {
          setCardType(null);
        }
      }

      if (input.length === 16) {
        setIsValid(isValidCardNumber(input));
      }
    };

    const toggleMask = () => setShowFullCard(!showFullCard);

    const handleCardTypeSelect = (type: CreditType) => {
      setCardType(type);
      const prefix = type === CreditType.VisaCard ? '4' :
        type === CreditType.MasterCard ? '5' :
          type === CreditType.DinersClub ? '30' : '';

      setCard(prefix);
    };

    return (<>
      <div className="card-type-buttons l">
        {Object.values(CreditType).map((type) => (
          <button
            key={type}
            onClick={() => handleCardTypeSelect(type)}
            className={`bubble-button ${cardType === type ? 'toggled' : ''} max`}
          >
            <ImagE src={
              type === CreditType.VisaCard ? 'https://cdn4.iconfinder.com/data/icons/flat-brand-logo-2/512/visa-512.png' :
                type === CreditType.MasterCard ? 'https://static-00.iconduck.com/assets.00/mastercard-icon-2048x1225-3kb6axel.png' :
                  type === CreditType.DinersClub ? 'https://www.serbianlogo.com/thumbnails/dina_card.gif' : ''}
              style={ImageStyle.PRODUCT}
              size={Size.MAX}
            ></ImagE>
          </button>
        ))}
        <Input
          placeholder="DATE"
          size={Size.MEDIUM}
          style={InputStyle.MIN}
        ></Input>
      </div >
      <div className={`floating-label ${size}`}>
        <input
          className={`${isValid ? style : InputStyle.ERROR}-input max`}
          value={card}
          onChange={handleChange}
          placeholder={" "}
          type={showFullCard ? 'tel' : 'password'}
          maxLength={19}
          inputMode="numeric"
          pattern="[0-9\s]{13,19}"
          autoComplete="cc-number"
          required
          aria-label="Credit Card Number"
        />
        <span>{isValid ? placeholder : 'Invalid card number'}</span>

        <label className={`label-creditcard-checkbox s`}>
          <input
            onChange={toggleMask}
            className="show-creditcard-checkbox"
            type="checkbox"
          />
          <span className="cc-checkmark" />
          <p>Hide</p>
        </label>
      </div>
    </>);
  };

export default CreditCard;