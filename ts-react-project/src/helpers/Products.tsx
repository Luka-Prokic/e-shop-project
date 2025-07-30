import { CardContextState } from './AppContext';

export class FakeProduct implements CardContextState {
  card: { id: string; quantity: number; price: number; discount: number };
  image: string;

  constructor(id: string, image: string, price: number, discount: number = 0, quantity: number = 0) {
    this.card = { id, quantity, price, discount };
    this.image = image;
  }
}

export class Product implements CardContextState {
  
  card: { id: string; quantity: number; price: number; discount: number };
  name: string; 
  description: string; 
  image: string;
  tags: string[];

  constructor(id: string, name: string, image: string, description: string, price: number, discount: number = 0, tags: string[] = [], quantity: number = 0) {
    this.card = { id, quantity, price, discount };
    this.image = image;
    this.description = description;
    this.name = name;
    this.tags = tags;
  }
}