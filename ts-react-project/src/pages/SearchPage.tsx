import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../card_comp/Card';
import Buy from '../button_comp/Buy';
import { CardStyle, CardType, PriceType, Size } from '../helpers/compInterface';
import { Product } from '../helpers/Products';
import { ShopContext } from '../helpers/AppContext';
import './SearchPage.css';

export interface ISearchPage {
  style?: CardStyle;
  size?: Size;
  type?: string;
}

const SearchPage: React.FC<ISearchPage> = ({ style = CardStyle.GHOST, size = "fs", type = "search" }) => {
  const { searchWord } = useParams<{ searchWord: string }>();
  const [initialWidth, setInitialWidth] = useState<number | undefined>(undefined);
  const classNames = `search-page ${type} ${size}`;
  const containerStyle = initialWidth ? { width: `${initialWidth}px` } : {};
  const shopContext = useContext(ShopContext);
  const products = shopContext?.state.products || [];
  const [filteredProductsByName, setFilteredProductsByName] = useState<any[]>([]);
  const [filteredProductsByDescription, setFilteredProductsByDescription] = useState<any[]>([]);

  useEffect(() => {
    if (size === Size.FULLSCREEN) {
      setInitialWidth(window.innerWidth);
    }
  }, [size]);

  useEffect(() => {
    if (searchWord) {
      const lowerSearchWord = searchWord.toLowerCase();
      const resultsByName = products.filter((product) =>
        product.name?.toLowerCase().includes(lowerSearchWord)
      );
      const resultsByDescription = products.filter((product) =>
        product.description?.toLowerCase().includes(lowerSearchWord) &&
        !resultsByName.includes(product)
      );
      setFilteredProductsByName(resultsByName);
      setFilteredProductsByDescription(resultsByDescription);
    } else {
      setFilteredProductsByName([]);
      setFilteredProductsByDescription([]);
    }
  }, [searchWord, products]);

  return (
    <><h1>Search Results for "{searchWord}"</h1>
      {filteredProductsByName.length > 0 ? (<>
        <section className={classNames} style={containerStyle}>
          {filteredProductsByName.map((product: any) => (
            <Card
              key={product.card.id}
              product={product}
              style={style}
              type={CardType.SHOP}
              size={Size.SMALL}
            >
              <Buy>ADD</Buy>
              <b>{product instanceof Product && product.name}</b>
            </Card>
          ))}
        </section>
        <hr style={{border: '3px solid #ccc'}}/>
        <section className={classNames} style={containerStyle}>
          {filteredProductsByDescription.map((product: any) => (
            <Card
              key={product.card.id}
              product={product}
              style={style}
              type={CardType.SHOP}
              size={Size.SMALL}
              currency={PriceType.DINAR}
            >
              <Buy>ADD</Buy>
              <b>{product instanceof Product && product.name}</b>
            </Card>
          ))}
        </section>
      </>
      ) : (
        <>
          {(filteredProductsByDescription.length) === 0 && <p>No products found for "{searchWord}".</p>}
        </>
      )}
    </>
  );
};

export default SearchPage;