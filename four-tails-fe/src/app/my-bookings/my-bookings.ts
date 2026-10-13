import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type CalendarView = 'Month' | 'Week' | 'Day';

interface Booking {
  date: Date;
  time: string;
  pet: string;
  service: string;
  owner: string;
  color: 'blue' | 'yellow' | 'green';
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
  readonly bookings: Booking[] = this.createSampleBookings();

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
    return this.bookings.filter((booking) => this.isSameDate(booking.date, date));
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

  private createSampleBookings(): Booking[] {
    const monday = new Date();
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);

    const samples = [
      { offset: 1, time: '09:00', pet: 'Milo', service: 'Morning walk', owner: 'Sophie L.', color: 'blue' as const },
      { offset: 2, time: '11:30', pet: 'Luna', service: 'Day care', owner: 'James R.', color: 'yellow' as const },
      { offset: 3, time: '14:00', pet: 'Biscuit', service: 'Home visit', owner: 'Ava M.', color: 'green' as const },
      { offset: 5, time: '10:00', pet: 'Coco', service: 'Dog walking', owner: 'Noah K.', color: 'blue' as const },
    ];

    return samples.map((sample) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + sample.offset);
      return { ...sample, date };
    });
  }

  private isSameDate(first: Date, second: Date): boolean {
    return first.getFullYear() === second.getFullYear()
      && first.getMonth() === second.getMonth()
      && first.getDate() === second.getDate();
  }
}
