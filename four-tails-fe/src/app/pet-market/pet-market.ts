import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type ProductCategory = 'Food' | 'Toys' | 'Health' | 'Accessories';

interface Product {
  id: number;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  rating: string;
  badge?: string;
  icon: string;
  pack: string;
  packLabel: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-pet-market',
  imports: [CommonModule],
  templateUrl: './pet-market.html',
  styleUrl: './pet-market.css',
})
export class PetMarket {
  readonly categories: Array<'All' | ProductCategory> = ['All', 'Food', 'Toys', 'Health', 'Accessories'];
  activeCategory: 'All' | ProductCategory = 'All';
  searchQuery = '';
  cartOpen = false;
  cartItems: CartItem[] = [];

  readonly products: Product[] = [
    { id: 1, name: 'Ocean Catch Kibble', description: 'Salmon & brown rice · 2 kg', category: 'Food', price: 34.95, rating: '4.9', badge: 'Best seller', icon: '🐟', pack: 'ocean', packLabel: 'FRESH CATCH' },
    { id: 2, name: 'Sunday Roast Bites', description: 'Slow-cooked chicken · 1.5 kg', category: 'Food', price: 29.50, rating: '4.8', icon: '🍗', pack: 'roast', packLabel: 'SUNDAY ROAST' },
    { id: 3, name: 'The Long-Walk Lead', description: 'Recycled webbing · 2 m', category: 'Accessories', price: 24.00, rating: '4.9', badge: 'Staff pick', icon: '🦮', pack: 'lead', packLabel: 'GO EXPLORE' },
    { id: 4, name: 'Tug & Toss Rope', description: 'Organic cotton · made for play', category: 'Toys', price: 16.95, rating: '4.7', icon: '🪢', pack: 'rope', packLabel: 'PLAY TIME' },
    { id: 5, name: 'Daily Coat Care', description: 'Gentle oat shampoo · 300 ml', category: 'Health', price: 19.95, rating: '4.8', icon: '🫧', pack: 'care', packLabel: 'SOFT & CLEAN' },
    { id: 6, name: 'Pocket Treat Pouch', description: 'Washable canvas · clip-on', category: 'Accessories', price: 22.00, rating: '4.6', icon: '🧺', pack: 'pouch', packLabel: 'READY TO GO' },
    { id: 7, name: 'Crunchy Carrot Chews', description: 'Plant-powered dental treats · 8 pack', category: 'Toys', price: 12.50, rating: '4.9', icon: '🥕', pack: 'chews', packLabel: 'GOOD CHEW' },
    { id: 8, name: 'Calm Belly Probiotic', description: 'Daily digestive support · 60 g', category: 'Health', price: 27.95, rating: '4.8', icon: '🌿', pack: 'probiotic', packLabel: 'FEEL GOOD' },
  ];

  get filteredProducts(): Product[] {
    const query = this.searchQuery.trim().toLowerCase();
    return this.products.filter((product) => {
      const matchesCategory = this.activeCategory === 'All' || product.category === this.activeCategory;
      const matchesSearch = !query || `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }

  get cartCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  get cartTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  selectCategory(category: 'All' | ProductCategory): void {
    this.activeCategory = category;
  }

  onSearch(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
  }

  addToCart(product: Product): void {
    const existingItem = this.cartItems.find((item) => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
      return;
    }
    this.cartItems = [...this.cartItems, { product, quantity: 1 }];
  }

  changeQuantity(productId: number, amount: number): void {
    this.cartItems = this.cartItems
      .map((item) => item.product.id === productId ? { ...item, quantity: item.quantity + amount } : item)
      .filter((item) => item.quantity > 0);
  }

  quantityFor(productId: number): number {
    return this.cartItems.find((item) => item.product.id === productId)?.quantity ?? 0;
  }
}
