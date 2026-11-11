import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../utils/auth-service';
import type { BookingDto } from './my-bookings';
import { ApiUrlService } from '../utils/api-url.service';

export const myBookingsResolver: ResolveFn<{ bookings: BookingDto[] }> = () => {
    const http = inject(HttpClient);
    const auth = inject(AuthService);
    const apiUrl = inject(ApiUrlService);
    return forkJoin({
        bookings: http.get<BookingDto[]>(`${apiUrl.apiUrl}/api/getBookings/${auth.getUserId()}`,
            {
                params: { role: auth.getRole() + "", startDate: '2026-10-01', endDate: '2026-10-31' }
            }),
    });
};