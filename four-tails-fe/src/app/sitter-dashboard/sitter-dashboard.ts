import { Component } from '@angular/core';

interface EarningsPeriod {
  label: string;
  amount: number;
  height: number;
}

interface ServiceBooking {
  name: string;
  count: number;
  percentage: number;
  color: 'teal' | 'yellow' | 'coral' | 'green';
}

@Component({
  selector: 'app-sitter-dashboard',
  imports: [],
  templateUrl: './sitter-dashboard.html',
  styleUrl: './sitter-dashboard.css',
})
export class SitterDashboard {
  readonly currentMonth = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date());

  readonly earningsPeriods: EarningsPeriod[] = [
    { label: 'Week 1', amount: 640, height: 52 },
    { label: 'Week 2', amount: 820, height: 67 },
    { label: 'Week 3', amount: 710, height: 58 },
    { label: 'Week 4', amount: 985, height: 81 },
    { label: 'Week 5', amount: 730, height: 60 },
  ];

  readonly serviceBookings: ServiceBooking[] = [
    { name: 'Dog walking', count: 16, percentage: 42, color: 'teal' },
    { name: 'Day care', count: 11, percentage: 29, color: 'yellow' },
    { name: 'Overnight stay', count: 7, percentage: 18, color: 'coral' },
    { name: 'Home visits', count: 4, percentage: 11, color: 'green' },
  ];
}
