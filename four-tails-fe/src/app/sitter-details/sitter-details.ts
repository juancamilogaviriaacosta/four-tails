import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sitter-details',
  imports: [FormsModule],
  templateUrl: './sitter-details.html',
  styleUrl: './sitter-details.css',
})
export class SitterDetails {
  startDate = '';
  endDate = '';
  bookingRequested = false;

  readonly sitter = {
    name: 'Maya Watson',
    rating: '4.98',
    reviews: 42,
    address: 'Williamsburg, Brooklyn, New York',
    lastSeen: 'Active 12 minutes ago',
    rate: 48,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85',
  };

  readonly photos = [
    {
      url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1400&q=85',
      alt: 'A golden retriever enjoying a walk outdoors',
    },
    {
      url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=700&q=85',
      alt: 'A happy dog resting at home',
    },
    {
      url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=700&q=85',
      alt: 'Two dogs playing together',
    },
    {
      url: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=700&q=85',
      alt: 'A dog relaxing in a sunny room',
    },
  ];

  requestBooking(): void {
    this.bookingRequested = true;
  }
}
