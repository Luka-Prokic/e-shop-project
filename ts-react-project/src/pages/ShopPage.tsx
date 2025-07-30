import React, { useContext, useEffect, useState } from 'react';
import Card from '../card_comp/Card';
import Buy from '../button_comp/Buy';
import { ButtonStyle, CardStyle, CardType, PriceType, Size } from '../helpers/compInterface';
import { Product } from '../helpers/Products';
import '../container_comp/Container.css';
import { ShopContext } from '../helpers/AppContext';
import './ShopPage.css';
import LayoutPicker from '../custom_comp/LayoutPicker';
import { SortByType, useLayout } from '../helpers/LayoutContext';
import '../helpers/Layout.css';
import Button from '../button_comp/Button';
import SortByPicker from '../helpers/SortByPicker';
import Container from '../container_comp/Container';

export interface IShopPage {
  style?: CardStyle;
  type?: string;
  size?: Size;
  children?: React.ReactNode;
  product?: Product;
}

const ShopPage: React.FC<IShopPage> = ({ style = CardStyle.GHOST, size = 'fs', type = 'shop' }) => {
  const [initialWidth, setInitialWidth] = useState<number | undefined>(undefined);
  const containerStyle = initialWidth ? { width: `${initialWidth}px` } : {};
  const [isUpButtonVisible, setIsUpButtonVisible] = useState(false);
  const { layout, sortBy, pickedTags } = useLayout();
  const shopContext = useContext(ShopContext);
  const products = shopContext?.state.products || [];
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const classNames = `${type} ${size} ${layout}`;

  const sortProducts = (products: Product[]) => {
    let sorted = [...products];
    switch (sortBy.type) {
      case SortByType.PRICE:
        sorted.sort((a, b) => {
          const priceA = a.card.price * (1 - (a.card.discount ?? 0) / 100);
          const priceB = b.card.price * (1 - (b.card.discount ?? 0) / 100);
          return sortBy.direction === 'asc' ? priceA - priceB : priceB - priceA;
        });

        break;
      case SortByType.ALPHA:
        sorted.sort((a, b) => (sortBy.direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
        break;
      default:
        break;
    }
    return sorted;
  };

  const updateFilteredProducts = () => {
    if (pickedTags.length > 0) {
      const filtered = products.filter(product =>
        pickedTags.some(tag => product.tags?.includes(tag))
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  useEffect(() => {
    updateFilteredProducts();
  }, [pickedTags, products]);

  useEffect(() => {
    const sorted = sortProducts(filteredProducts);
    setSortedProducts(sorted);
  }, [filteredProducts, sortBy]);

  const handleScroll = () => {
    const ratio = 100;
    setIsUpButtonVisible(window.scrollY > ratio);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (size === Size.FULLSCREEN) {
        setInitialWidth(window.innerWidth);
      }
    };
    handleResize();
  }, [size]);

  return (
    <>
      <div className="shop-page-skelet" style={containerStyle}>
        <Container>
          <SortByPicker size={Size.MAX} />
          <LayoutPicker size={Size.MAX} />
        </Container>
        <section className={classNames}>
          {sortedProducts.length ? (
            sortedProducts.map((product) => {
              return (
                product instanceof Product && (
                  <Card
                    key={product.card.id}
                    product={product}
                    style={style}
                    type={CardType.SHOP}
                    size={Size.SMALL}
                    currency={PriceType.DINAR}
                  >
                    <Buy>ADD</Buy>
                    <b>{product.name}</b>
                    <p>{product.description}</p>
                  </Card>
                )
              );
            })
          ) : (
            <p>No products available.</p>
          )}
        </section>
      </div>
      <div className="shop-page-up-button">
        <Button
          style={ButtonStyle.BUBBLE}
          size={isUpButtonVisible ? Size.SEVEN : Size.NONE}
          action={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <b
            title-custom="go to top"
          >🡅</b>
        </Button>
      </div>
    </>
  );
};

export default ShopPage;