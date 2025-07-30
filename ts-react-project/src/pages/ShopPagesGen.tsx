import React, { useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ShopContext, ShopState } from '../helpers/AppContext';
import Loader from '../image_comp/Loader';
import Button from '../button_comp/Button';
import Container from '../container_comp/Container';
import { ButtonStyle, ConType, InputStyle, InputType, Size } from '../helpers/compInterface';
import ShopPage from './ShopPage';
import Lake from '../custom_comp/Lake';
import NAVIGATOR from '../custom_comp/Navigator';
import ProductPage from './ProductPage';
import CountryInput from '../input_comp/CountryInput';
import SearchPage from './SearchPage';
import { LayoutProvider } from '../helpers/LayoutContext';
import CheckoutPage from './CheckoutPage';

const ShopPagesGen = () => {
    const shopContext = useContext(ShopContext);
    const products = shopContext?.state.products || [];
    const location = useLocation();

    return (
        <LayoutProvider>
            {!['/checkout'].includes(location.pathname) && <NAVIGATOR />}
            <div style={{ height: '32px' }} />
            {products.length ? (
                <Routes>
                    <Route path="/" element={
                        <Lake
                            type={ConType.FC}
                            size={Size.FULLSCREEN}
                        >
                            <Button
                                style={ButtonStyle.BUBBLE}
                                size={Size.SEVEN}
                            />
                        </Lake>
                    } />
                    <Route path="/shop" element={
                        <ShopPage type={'mine'} />
                    } />
                    <Route path="/checkout" element={
                        <CheckoutPage />
                    } />
                    <Route path="/aboutus" element={<>
                    </>
                    } />
                    <Route path="/search/:searchWord" element={<SearchPage />} />
                    {products.map((product) => (
                        <Route
                            key={product.card.id}
                            path={`/${product.card.id}`}
                            element={<ProductPage product={product} />}
                        />
                    ))}
                </Routes >
            ) : (
                <Container type={ConType.FC}>
                    <Loader margin={'12px'} />
                </Container>
            )}
        </LayoutProvider>
    );
};

export default ShopPagesGen;