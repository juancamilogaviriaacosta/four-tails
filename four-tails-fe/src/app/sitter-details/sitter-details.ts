import { ChangeDetectorRef, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Utils } from '../utils/utils';
import { ActivatedRoute } from '@angular/router';
import { TimeAgoPipe } from '../utils/time-ago.pipe';
import { AuthService } from '../utils/auth-service';

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
  pets = '';
  address = '';
  service = '';

  constructor(private ar: ActivatedRoute, private http: HttpClient, private cd: ChangeDetectorRef, private auth: AuthService) {
    this.sitter = this.ar.snapshot.data['preload'].sitter;
    const queryParams = this.ar.snapshot.queryParamMap;
    this.pets = queryParams.get('pets') ?? '';
    this.address = queryParams.get('address') ?? '';
    this.service = queryParams.get('service') ?? '';

    const today = new Date();
    this.startDate = queryParams.get('startDate') ?? Utils.toDateInputValue(today);

    const checkout = new Date(today);
    checkout.setDate(checkout.getDate() + 4);
    this.endDate = queryParams.get('endDate') ?? Utils.toDateInputValue(checkout);
  }

  requestBooking(): void {
    this.bookingError = '';
    this.bookingConfirmationOpen = true;
  }

  cancelBooking(): void {
    this.bookingConfirmationOpen = false;
  }

  confirmBooking(): void {
    this.http.post('/api/confirmBooking', {
      userId : this.auth.getUserId(),
      providerId: this.sitter.id,
      serviceId: this.service,
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
