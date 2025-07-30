import { ExcludeFullscreen, PriceStyle, PriceType, Size } from '../helpers/compInterface';
import './Price.css';
import React, { ReactDOM } from 'react';

export interface IPrice {
    style?: PriceStyle;
    size?: ExcludeFullscreen<Size>;
    price?: number;
    discount?: number;
    sum?: number;
    currency?: PriceType;
    children?: React.ReactNode;
}


const Price: React.FC<IPrice> = ({ style = PriceStyle.PORT, size = Size.MAX, sum, price = 0, discount, currency = "€" }) => {
    const className = `${style}-price ${size}`;
    const formattedPrice = price.toFixed(2);
    const formattedSum = sum ? (sum.toFixed(2) === formattedPrice) ? undefined : sum.toFixed(2) : undefined;

    return (<div className={className}>
        {discount ?
            (<>
                {formattedSum ?
                    (<>
                        <span>{(price * ((100 - discount) / 100)).toFixed(2)}{currency}</span>
                        <del>{formattedPrice}</del>
                        <p>{formattedSum}{currency}</p>
                    </>
                    ) : (
                        <>
                            <span>{(price * ((100 - discount) / 100)).toFixed(2)}{currency}</span>
                            <del>{formattedPrice}</del>
                        </>
                    )}
            </>) : (<>
                {formattedSum ?
                    (<>
                        <span>{formattedSum}{currency}</span>
                        <del>{formattedPrice}</del>
                    </>
                    ) : (
                        <p>{formattedPrice}{currency}</p>)}
            </>)}
    </div>)
}

export default Price;