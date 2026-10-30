import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

type CalendarView = 'Month' | 'Week' | 'Day';

export interface BookingResponse {
  /*startDate: Date | string;
  time: string;
  pets: string;
  service: string;
  owner: string;
  color: 'blue' | 'yellow' | 'green';*/

  userName: string
  providerId: number;
  providerName: string;
  serviceId: number;
  serviceName: string;
  startDate: Date;
  endDate: Date;
  fare: number;
  pets: string;
  address: string;
  color: string;
  notes: string;
}

interface Booking extends Omit<BookingResponse, 'startDate'> {
  startDate: Date;
}

interface PendingBooking {
  id: number;
  owner: string;
  initials: string;
  pet: string;
  service: string;
  startDate: Date;
  time: string;
  color: Booking['color'];
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
  readonly weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  readonly bookings: Booking[];
  pendingRequests: PendingBooking[] = this.createSamplePendingRequests();
  isPendingModalOpen = false;

  constructor(private readonly route: ActivatedRoute) {
    const bookings = this.route.snapshot.data['preload'].bookings as BookingResponse[];
    this.bookings = bookings.map((booking) => ({
      ...booking,
      startDate: this.parseBookingDate(booking.startDate),
    }));
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

  resolvePendingRequest(id: number, accepted = false): void {
    const request = this.pendingRequests.find((pending) => pending.id === id);
    if (accepted && request) {
      /*this.bookings.push({
        startDate: request.startDate,
        //time: request.time,
        pet: request.pet,
        service: request.service,
        owner: request.owner,
        color: request.color,
      });*/
    }
    this.pendingRequests = this.pendingRequests.filter((request) => request.id !== id);
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

  goToToday(): void {
    this.currentDate = new Date();
  }

  selectDate(date: Date): void {
    this.currentDate = new Date(date);
    this.activeView = 'Day';
  }

  bookingsForDate(date: Date): Booking[] {
    return this.bookings.filter((booking) => this.isSameDate(booking.startDate, date));
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

  private createSamplePendingRequests(): PendingBooking[] {
    const monday = new Date();
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);

    const samples = [
      { id: 1, owner: 'Olivia Bennett', initials: 'OB', pet: 'Milo', service: 'Dog walking', offset: 2, time: '09:30', color: 'blue' as const, note: 'Milo loves a long walk in the park. His leash and treats will be ready by the door.' },
      { id: 2, owner: 'Ethan Parker', initials: 'EP', pet: 'Daisy', service: 'Day care', offset: 4, time: '08:00', color: 'yellow' as const, note: 'Daisy is friendly and gets along well with other dogs. She takes medication with lunch.' },
      { id: 3, owner: 'Amelia Brooks', initials: 'AB', pet: 'Oliver', service: 'Home visit', offset: 5, time: '12:00', color: 'green' as const, note: 'Oliver needs a quick lunch visit and some company while I am away.' },
    ];

    return samples.map((sample) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + sample.offset);
      return { ...sample, startDate: date };
    });
  }

  private parseBookingDate(value: Date | string): Date {
    let date: Date;
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split('-').map(Number);
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
}
