import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type OrderStatus = 'processing' | 'delivered' | 'canceled';

interface OrderProduct {
  id: number;
  name: string;
  quantity: number;
  price: number;
  icon: string;
}

interface TrackingUpdate {
  label: string;
  date: Date;
}

interface ShopOrder {
  id: string;
  date: Date;
  status: OrderStatus;
  products: OrderProduct[];
  total: number;
  carrier: string;
  trackingNumber: string;
  trackingUpdates: TrackingUpdate[];
}

@Component({
  selector: 'app-my-orders',
  imports: [CommonModule],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css',
})
export class MyOrders {
  readonly orders = this.createSampleOrders();
  expandedOrderId: string | null = null;

  toggleTracking(orderId: string): void {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  private createSampleOrders(): ShopOrder[] {
    return [
      {
        id: 'FT-2048',
        date: this.daysAgo(2),
        status: 'processing',
        products: [
          { id: 1, name: 'Ocean Catch Kibble', quantity: 1, price: 34.95, icon: '🐟' },
          { id: 2, name: 'Pocket Treat Pouch', quantity: 1, price: 22.00, icon: '🧺' },
        ],
        total: 56.95,
        carrier: 'Australia Post',
        trackingNumber: 'AP 7350 1842 6091',
        trackingUpdates: [
          { label: 'Order confirmed', date: this.daysAgo(2) },
          { label: 'Being prepared by the seller', date: this.daysAgo(1) },
          { label: 'Handed to carrier', date: this.daysAgo(0) },
        ],
      },
      {
        id: 'FT-1982',
        date: this.daysAgo(8),
        status: 'delivered',
        products: [
          { id: 3, name: 'Tug & Toss Rope', quantity: 2, price: 16.95, icon: '🪢' },
          { id: 4, name: 'Daily Coat Care', quantity: 1, price: 19.95, icon: '🫧' },
        ],
        total: 53.85,
        carrier: 'Sendle',
        trackingNumber: 'SND 4286 9031 5570',
        trackingUpdates: [
          { label: 'Order confirmed', date: this.daysAgo(8) },
          { label: 'Packed and ready to ship', date: this.daysAgo(7) },
          { label: 'On the way', date: this.daysAgo(6) },
          { label: 'Delivered to your address', date: this.daysAgo(4) },
        ],
      },
      {
        id: 'FT-1837',
        date: this.daysAgo(19),
        status: 'delivered',
        products: [
          { id: 5, name: 'Sunday Roast Bites', quantity: 1, price: 29.50, icon: '🍗' },
          { id: 6, name: 'Crunchy Carrot Chews', quantity: 2, price: 12.50, icon: '🥕' },
        ],
        total: 54.50,
        carrier: 'Australia Post',
        trackingNumber: 'AP 2694 5701 8832',
        trackingUpdates: [
          { label: 'Order confirmed', date: this.daysAgo(19) },
          { label: 'Packed and ready to ship', date: this.daysAgo(18) },
          { label: 'On the way', date: this.daysAgo(17) },
          { label: 'Delivered to your address', date: this.daysAgo(15) },
        ],
      },
      {
        id: 'FT-1710',
        date: this.daysAgo(31),
        status: 'canceled',
        products: [
          { id: 7, name: 'Calm Belly Probiotic', quantity: 1, price: 27.95, icon: '🌿' },
        ],
        total: 27.95,
        carrier: 'Order canceled',
        trackingNumber: 'No tracking number',
        trackingUpdates: [
          { label: 'Order canceled and payment refunded', date: this.daysAgo(30) },
        ],
      },
    ];
  }

  private daysAgo(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - days);
    date.setHours(12, 0, 0, 0);
    return date;
  }
}
