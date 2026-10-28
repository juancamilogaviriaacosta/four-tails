import { ChangeDetectorRef, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Utils } from '../utils/utils';
import { ActivatedRoute } from '@angular/router';
import { TimeAgoPipe } from '../utils/time-ago.pipe';

@Component({
  selector: 'app-sitter-details',
  imports: [FormsModule, TimeAgoPipe],
  templateUrl: './sitter-details.html',
  styleUrl: './sitter-details.css',
})
export class SitterDetails {
  startDate = '';
  endDate = '';
  bookingConfirmationOpen = false;
  bookingRequested = false;
  bookingError = '';
  sitter: any;

  constructor(private ar: ActivatedRoute, private http: HttpClient, private cd: ChangeDetectorRef) {
    this.sitter = this.ar.snapshot.data['preload'].sitter;
    const today = new Date();
    this.startDate = Utils.toDateInputValue(today);

    const checkout = new Date(today);
    checkout.setDate(checkout.getDate() + 4);
    this.endDate = Utils.toDateInputValue(checkout);
  }

  requestBooking(): void {
    this.bookingError = '';
    this.bookingConfirmationOpen = true;
  }

  cancelBooking(): void {
    this.bookingConfirmationOpen = false;
  }

  confirmBooking(): void {
    this.bookingError = '';
    this.http.post('/api/confirmBooking', {
      clientId: 1,
      providerId: this.sitter.id,
      serviceId: 1,
      startDate: `${this.startDate}T00:00:00Z`,
      endDate: `${this.endDate}T00:00:00Z`,
      fare: 150,
      notes: '',
    }).subscribe({
      next: () => {
        this.bookingConfirmationOpen = false;
        this.bookingRequested = true;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error confirming booking:', error);
        this.bookingError = 'Could not submit the booking request. Please try again.';
        this.cd.detectChanges();
      },
    });
  }
}
