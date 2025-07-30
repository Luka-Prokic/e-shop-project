import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { Product } from './Products';

export const ShopContext = createContext<ShopContextType | undefined>(undefined);

interface ShopProviderProps {
  children: ReactNode;
}

interface ShopContextState {
  cart: CardContextState[];
  products: Product[];
  tags: string[];
}

interface ShopContextType {
  state: ShopContextState;
  setState: (value: Partial<ShopContextState>) => void;
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  updateCart: (id: string, quantity: number) => void;
  priceOfCart: () => PriceOfCart;
}

export interface CardContextState {
  card: { id: string; quantity: number; price: number; discount: number };
}

export interface CardContextType {
  state: CardContextState;
  setState: (value: Partial<CardContextState>) => void;
}

interface PriceOfCart {
  sum: number;
  trueSum: number;
}

export const ShopState: React.FC<ShopProviderProps> = ({ children }) => {
  const getInitialCart = () => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        return parsedCart.filter((item: CardContextState) => item.card && item.card.id);
      }
    }
    return [];
  };

  const [state, setState] = useState<ShopContextState>({
    cart: getInitialCart(),
    products: [],
    tags: []
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  const updateState = (newState: Partial<ShopContextState>) => {
    setState((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/products');
        const data = await res.json();
        const products = data.items.map((item) => {
          return new Product(
            item.id,
            item.name,
            `http://localhost:8090/api/files/temu/${item.id}/${item.image}`,
            item.description,
            item.price,
            item.discount,
            item.tags
          );
        });


        setState((prevState) => ({
          ...prevState,
          products: [...products],
        }));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchTags = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/tags');
        const data = await res.json();
        const tagsArray = data.items.sort((a, b) => a.name.localeCompare(b.name)).map((item) => {
          return item.name
        });

        setState((prevState) => ({
          ...prevState,
          tags: [...tagsArray],
        }));
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchProducts();
    fetchTags();
  }, []);

  const addToCart = (newProduct: any) => {
    setState((prevState) => {
      const existingProduct = prevState.cart.find((product) => product.card.id === newProduct.card.id);
      if (existingProduct) {
        const updatedCart = prevState.cart.map((product) =>
          product.card.id === newProduct.card.id ? newProduct : product
        );
        return { ...prevState, cart: updatedCart };
      } else {
        return { ...prevState, cart: [...prevState.cart, newProduct] };
      }
    });
  };

  const removeFromCart = (id: string) => {
    setState((prevState) => ({
      ...prevState,
      cart: prevState.cart.filter((product) => product.card.id !== id),
    }));
  };

  const updateCart = (id: string, quantity: number) => {
    setState((prevState) => ({
      ...prevState,
      cart: prevState.cart.map((product) =>
        product.card.id === id ? { ...product, card: { ...product.card, quantity } } : product
      ),
    }));
  };

  const priceOfCart = (): PriceOfCart => {
    const sum = state.cart.reduce((sum, item) => sum + item.card.price * item.card.quantity, 0);
    const trueSum = state.cart.reduce(
      (sum, item) => sum + item.card.price * item.card.quantity * ((100 - item.card.discount) / 100),
      0
    );
    return { sum, trueSum };
  };

  const getProductById = (id: string): any => {
    return state.products.find((product) => product.card.id === id);
  };

  return (
    <ShopContext.Provider
      value={{ state, setState: updateState, addToCart, removeFromCart, getProductById, updateCart, priceOfCart }}
    >
      {children}
    </ShopContext.Provider>
  );
};