import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../utils/auth-service';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../utils/loading-service';
import { FirebaseNotificationService } from '../firebase/firebase-notification.service';
import { ApiUrlService } from '../utils/api-url.service';

type CalendarView = 'Month' | 'Week' | 'Day';

export interface BookingDto {
  bookingId: number;
  clientId: number;
  clientName: string
  providerId: number;
  providerName: string;
  serviceId: number;
  serviceName: string;
  serviceColor: string;
  startDate: Date;
  endDate: Date;
  fare: number;
  pets: string;
  address: string;
  notes: string;
  status: string;
  cancellationReason: string;
  currentRole: String;
}

interface Booking extends Omit<BookingDto, 'startDate' | 'endDate'> {
  startDate: Date;
  endDate: Date;
}

interface PendingBooking {
  id: number;
  owner: string;
  initials: string;
  pet: string;
  service: string;
  startDate: Date;
  time: string;
  serviceColor: Booking['serviceColor'];
  note: string;
}

@Component({
  selector: 'app-my-bookings',
  imports: [CommonModule],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css',
})

export class MyBookings {
  activeView: CalendarView = 'Month';
  currentDate = new Date();
  weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  bookings: Booking[];
  isPendingModalOpen = false;
  selectedBookingForReply: Booking | null = null;
  isReplyingBooking = false;
  selectedBookingForCancellation: Booking | null = null;
  cancellationError = '';
  allServices: any = [];

  constructor (
      private readonly route: ActivatedRoute,
      public auth: AuthService,
      private http: HttpClient,
      private loadingService: LoadingService,
      private notificationService: FirebaseNotificationService,
      private cd: ChangeDetectorRef, 
      private apiUrl: ApiUrlService) {
    const bookings = this.route.snapshot.data['preload'].bookings as BookingDto[];
    this.allServices = this.extractAndSortAllServices(bookings);
    this.bookings = bookings.map((booking) => ({
      ...booking,
      startDate: this.parseBookingDate(booking.startDate),
      endDate: this.parseBookingDate(booking.endDate),
    }));
  }

  extractAndSortAllServices(bookings: BookingDto[]) {
    const services = new Map<number, { id: number; name: string; serviceColor: string; }>();
    for (const booking of bookings) {
      if (!services.has(booking.serviceId)) {
        services.set(booking.serviceId, { id: booking.serviceId, name: booking.serviceName, serviceColor: booking.serviceColor });
      }
    }

    return Array.from(services.values())
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  get monthLabel(): string {
    return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(this.currentDate);
  }

  get periodLabel(): string {
    if (this.activeView === 'Month') return this.monthLabel;
    if (this.activeView === 'Day') {
      return new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
        .format(this.currentDate);
    }

    const week = this.weekDays;
    const start = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(week[0]);
    const end = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(week[6]);
    return `${start} - ${end}`;
  }

  get bookingsThisWeek(): number {
    return this.bookings.filter((booking) =>
      this.weekDays.some((date) => this.isSameDate(booking.startDate, date)),
    ).length;
  }

  openPendingModal(): void {
    this.isPendingModalOpen = true;
  }

  closePendingModal(): void {
    this.isPendingModalOpen = false;
  }

  openCancellationModal(booking: Booking): void {
    this.selectedBookingForCancellation = booking;
    this.cancellationError = '';
  }

  closeCancellationModal(): void {
    this.selectedBookingForCancellation = null;
    this.cancellationError = '';
  }

  confirmCancellation(reason: string): void {
    if (!this.selectedBookingForCancellation) return;
    if (!reason.trim()) {
      this.cancellationError = 'Please provide a reason for cancelling this booking.';
      return;
    }

    this.http.post(`${this.apiUrl.apiUrl}/api/cancelBooking`, { ...this.selectedBookingForCancellation, cancellationReason: reason, currentRole: this.auth.getRole() }).subscribe({
      next: (response: any) => {
        this.loadingService.hide();
        this.bookings = response.map((booking: BookingDto) => ({
          ...booking,
          startDate: this.parseBookingDate(booking.startDate),
          endDate: this.parseBookingDate(booking.endDate),
        }));
        this.cd.detectChanges();
      },
      error: (error) => {
        alert('Unexpected error');
        this.loadingService.hide();
      }
    });
    this.closeCancellationModal();
  }

  openBookingReply(booking: Booking): void {
    this.selectedBookingForReply = booking;
  }

  closeBookingReply(): void {
    if (this.isReplyingBooking) return;
    this.selectedBookingForReply = null;
  }

  replyBooking(status: 'CONFIRMED' | 'REJECTED'): void {
    const booking = this.selectedBookingForReply;
    if (!booking || this.isReplyingBooking) return;

    this.isReplyingBooking = true;
    this.http.post(`${this.apiUrl.apiUrl}/api/replyBookingRequest`, {
      bookingId: booking.bookingId,
      providerId: booking.providerId,
      currentRole: this.auth.getRole(),
      status,
    }).subscribe({
      next: () => {
        booking.status = status;
        this.isReplyingBooking = false;
        this.selectedBookingForReply = null;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error replying to booking:', error);
        alert('Could not reply to the booking. Please try again.');
        this.isReplyingBooking = false;
        this.cd.detectChanges();
      },
    });
  }

  get monthDays(): Date[] {
    const firstOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const mondayOffset = (firstOfMonth.getDay() + 6) % 7;
    const firstCell = new Date(firstOfMonth);
    firstCell.setDate(firstCell.getDate() - mondayOffset);
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(firstCell);
      date.setDate(firstCell.getDate() + index);
      return date;
    });
  }

  get weekDays(): Date[] {
    const monday = new Date(this.currentDate);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return date;
    });
  }

  setView(view: CalendarView): void {
    this.activeView = view;
  }

  navigatePeriod(amount: number): void {
    const nextDate = new Date(this.currentDate);
    if (this.activeView === 'Month') {
      nextDate.setDate(1);
      nextDate.setMonth(nextDate.getMonth() + amount);
    } else {
      nextDate.setDate(nextDate.getDate() + amount * (this.activeView === 'Week' ? 7 : 1));
    }
    this.currentDate = nextDate;
  }

  async enableNotifications() {
    await this.notificationService.enableNotifications();
  }

  goToToday(): void {
    this.currentDate = new Date();
  }

  selectDate(date: Date): void {
    this.currentDate = new Date(date);
    this.activeView = 'Day';
  }

  bookingsForDate(date: Date): Booking[] {
    const day = this.startOfDay(date).getTime();
    return this.bookings.filter((booking) => {
      const start = this.startOfDay(booking.startDate).getTime();
      const end = this.startOfDay(booking.endDate).getTime();
      return day >= start && day <= end;
    });
  }

  bookingTimeForDate(booking: Booking, date: Date): string {
    if (this.isSameDate(booking.startDate, date)) {
      return new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit', hour12: false }).format(booking.startDate);
    }
    if (this.isSameDate(booking.endDate, date)) {
      return new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit', hour12: false }).format(booking.endDate);
    }
    return 'All day';
  }

  bookingStatusClass(status: string): string {
    return `booking-status-${status.toLowerCase().replaceAll('_', '-')}`;
  }

  bookingStatusLabel(status: string): string {
    return status.replaceAll('_', ' ');
  }

  isBookingCancelled(booking: Booking): boolean {
    return booking.status === 'CANCELED' || booking.status === 'CANCELLED';
  }

  isToday(date: Date): boolean {
    return this.isSameDate(date, new Date());
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentDate.getMonth();
  }

  trackDate(_index: number, date: Date): number {
    return date.getTime();
  }

  private parseBookingDate(value: Date | string): Date {
    let date: Date;
    const calendarDate = typeof value === 'string'
      ? /^(\d{4})-(\d{2})-(\d{2})(?:T00:00:00(?:\.0+)?Z)?$/.exec(value)
      : null;
    if (calendarDate) {
      const [year, month, day] = calendarDate.slice(1).map(Number);
      date = new Date(year, month - 1, day);
    } else {
      date = new Date(value);
    }

    if (Number.isNaN(date.getTime())) {
      throw new Error(`Invalid booking date: ${value}`);
    }

    return date;
  }

  private isSameDate(first: Date, second: Date): boolean {
    return first.getFullYear() === second.getFullYear()
      && first.getMonth() === second.getMonth()
      && first.getDate() === second.getDate();
  }

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}
