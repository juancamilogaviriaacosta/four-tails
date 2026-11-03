import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../utils/auth-service';
import type { BookingDto } from './my-bookings';

export const myBookingsResolver: ResolveFn<{ bookings: BookingDto[] }> = () => {
    const http = inject(HttpClient);
    const auth = inject(AuthService);
    return forkJoin({
        bookings: http.get<BookingDto[]>(`/api/getBookings/${auth.getUserId()}`,
            {
                params: { role: auth.getRole() + "", startDate: '2026-10-01', endDate: '2026-10-31' }
            }),
    });
};