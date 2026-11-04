import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { vi } from 'vitest';

import { MyBookings } from './my-bookings';

describe('MyBookings', () => {
  let component: MyBookings;
  let fixture: ComponentFixture<MyBookings>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyBookings],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                preload: {
                  bookings: [
                    {
                      bookingId: 1,
                      userName: 'Sophie L.',
                      providerId: 1,
                      providerName: 'Sophie L.',
                      serviceId: 1,
                      serviceName: 'Dog walking',
                      startDate: '2026-10-28T09:00:00',
                      endDate: '2026-10-28T10:00:00',
                      fare: 25,
                      color: 'blue',
                      pets: 'Milo',
                      address: 'Park',
                      notes: '',
                    },
                    {
                      bookingId: 2,
                      userName: 'James R.',
                      providerId: 2,
                      providerName: 'James R.',
                      serviceId: 2,
                      serviceName: 'Day care',
                      startDate: '2026-11-02T11:30:00',
                      endDate: '2026-11-02T12:30:00',
                      fare: 30,
                      color: 'yellow',
                      pets: 'Luna',
                      address: 'Home',
                      notes: '',
                    },
                    {
                      bookingId: 3,
                      userName: 'Alex M.',
                      providerId: 3,
                      providerName: 'Alex M.',
                      serviceId: 3,
                      serviceName: 'Home visit',
                      startDate: '2026-11-20T00:00:00Z',
                      endDate: '2026-11-20T01:00:00Z',
                      fare: 35,
                      color: 'green',
                      pets: 'Oliver',
                      address: 'Home',
                      notes: '',
                    },
                    {
                      bookingId: 4,
                      userName: 'Taylor P.',
                      providerId: 4,
                      providerName: 'Taylor P.',
                      serviceId: 4,
                      serviceName: 'Pet sitting',
                      startDate: '2026-11-02T16:00:00',
                      endDate: '2026-11-05T10:00:00',
                      fare: 80,
                      color: 'purple',
                      serviceColor: 'purple',
                      pets: 'Poppy',
                      address: 'Home',
                      notes: '',
                    },
                  ],
                },
              },
            },
          },
        },
      ],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(MyBookings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use bookings from route data and normalize their start dates', () => {
    expect(component.bookings).toHaveLength(4);
    expect(component.bookings[0].pets).toBe('Milo');
    expect(component.bookings[0].startDate).toEqual(new Date('2026-10-28T09:00:00'));
    expect(component.bookings[2].startDate).toEqual(new Date(2026, 10, 20));
  });

  it('should display the start date as an hour in the calendar', () => {
    fixture.detectChanges();

    const octoberDays = component.monthDays;
    const octoberCellIndex = octoberDays.findIndex((date) => date.getMonth() === 9 && date.getDate() === 28);
    expect(fixture.nativeElement.querySelectorAll('.month-cell')[octoberCellIndex].querySelector('strong')?.textContent.trim()).toBe('09:00');
  });

  it('should count bookings in the selected week', () => {
    fixture.detectChanges();
    component.currentDate = new Date(2026, 9, 29);

    expect(component.bookingsThisWeek).toBe(1);
  });

  it('lets a provider reply to a pending booking by rejecting or confirming it', async () => {
    const booking = component.bookings[3];
    booking.status = 'PENDING';
    vi.spyOn(component.auth, 'getRole').mockReturnValue('PROVIDER');
    fixture.detectChanges();

    const todayIndex = component.monthDays.findIndex((date) =>
      date.getFullYear() === component.currentDate.getFullYear()
      && date.getMonth() === component.currentDate.getMonth()
      && date.getDate() === component.currentDate.getDate(),
    );
    (fixture.nativeElement.querySelectorAll('.month-cell')[todayIndex] as HTMLButtonElement).click();
    await fixture.whenStable();

    const replyButton = fixture.nativeElement.querySelector('.reply-booking-button') as HTMLButtonElement;
    expect(replyButton?.textContent.trim()).toBe('Reply');
    expect(replyButton).toBeTruthy();
    replyButton.click();
    fixture.detectChanges();

    const replyDialog = fixture.nativeElement.querySelector('#booking-reply-title')?.closest('[role="dialog"]');
    expect(replyDialog?.textContent).toContain('Choose whether to reject or confirm');
    expect(replyDialog?.querySelector('.booking-reply-reject')?.textContent.trim()).toBe('Reject');
    expect(replyDialog?.querySelector('.booking-reply-confirm')?.textContent.trim()).toBe('Confirm');
    (replyDialog?.querySelector('.booking-reply-reject') as HTMLButtonElement).click();
    fixture.detectChanges();
    const rejectRequest = httpTestingController.expectOne('/api/replyBookingRequest');
    expect(rejectRequest.request.method).toBe('POST');
    expect(rejectRequest.request.body).toEqual({
      bookingId: booking.bookingId,
      providerId: booking.providerId,
      currentRole: 'PROVIDER',
      status: 'REJECTED',
    });
    expect(booking.status).toBe('PENDING');
    rejectRequest.flush({ message: 'ok' });
    expect(fixture.nativeElement.querySelector('#booking-reply-title')).toBeNull();
    expect(booking.status).toBe('REJECTED');

    const confirmFixture = TestBed.createComponent(MyBookings);
    const confirmComponent = confirmFixture.componentInstance;
    const pendingBooking = confirmComponent.bookings[3];
    pendingBooking.status = 'PENDING';
    vi.spyOn(confirmComponent.auth, 'getRole').mockReturnValue('PROVIDER');
    confirmFixture.detectChanges();
    const confirmTodayIndex = confirmComponent.monthDays.findIndex((date) =>
      date.getFullYear() === confirmComponent.currentDate.getFullYear()
      && date.getMonth() === confirmComponent.currentDate.getMonth()
      && date.getDate() === confirmComponent.currentDate.getDate(),
    );
    (confirmFixture.nativeElement.querySelectorAll('.month-cell')[confirmTodayIndex] as HTMLButtonElement).click();
    await confirmFixture.whenStable();
    (confirmFixture.nativeElement.querySelector('.reply-booking-button') as HTMLButtonElement).click();
    confirmFixture.detectChanges();
    const reopenedDialog = confirmFixture.nativeElement.querySelector('#booking-reply-title')?.closest('[role="dialog"]');
    (reopenedDialog?.querySelector('.booking-reply-confirm') as HTMLButtonElement).click();
    confirmFixture.detectChanges();

    const request = httpTestingController.expectOne('/api/replyBookingRequest');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      bookingId: pendingBooking.bookingId,
      providerId: pendingBooking.providerId,
      currentRole: 'PROVIDER',
      status: 'CONFIRMED',
    });
    expect(pendingBooking.status).toBe('PENDING');

    request.flush({ message: 'ok' });

    expect(pendingBooking.status).toBe('CONFIRMED');
  });

  it('should show a multi-day booking on every covered date in Month and Week views', async () => {
    const booking = component.bookings[3];

    expect(component.bookingsForDate(new Date(2026, 10, 2))).toContain(booking);
    expect(component.bookingsForDate(new Date(2026, 10, 3))).toContain(booking);
    expect(component.bookingsForDate(new Date(2026, 10, 4))).toContain(booking);
    expect(component.bookingsForDate(new Date(2026, 10, 5))).toContain(booking);
    expect(component.bookingsForDate(new Date(2026, 10, 6))).not.toContain(booking);

    const rangeFixture = TestBed.createComponent(MyBookings);
    const rangeComponent = rangeFixture.componentInstance;
    rangeComponent.currentDate = new Date(2026, 10, 4);
    rangeFixture.detectChanges();
    const novemberDays = rangeComponent.monthDays;
    const novemberCellIndex = novemberDays.findIndex((date) => date.getMonth() === 10 && date.getDate() === 4);
    expect(rangeFixture.nativeElement.querySelectorAll('.month-cell')[novemberCellIndex].textContent).toContain('Poppy');

    rangeFixture.nativeElement.querySelector('.view-switcher button:nth-child(2)').click();
    await rangeFixture.whenStable();

    expect(rangeFixture.nativeElement.querySelectorAll('.booking-event')).toHaveLength(5);
    expect(component.bookingTimeForDate(booking, new Date(2026, 10, 3))).toBe('All day');
    expect(component.bookingTimeForDate(booking, new Date(2026, 10, 5))).toBe('10:00');
  });

  it('should identify cancelled bookings for all calendar views', () => {
    const booking = component.bookings[0];
    booking.status = 'CANCELED';
    expect(component.isBookingCancelled(booking)).toBe(true);

    booking.status = 'CANCELLED';
    expect(component.isBookingCancelled(booking)).toBe(true);
  });

  it('maps each booking status to its badge class and readable label', () => {
    const statuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REJECTED'];

    for (const status of statuses) {
      expect(component.bookingStatusClass(status)).toBe(`booking-status-${status.toLowerCase().replaceAll('_', '-')}`);
      expect(component.bookingStatusLabel(status)).toBe(status.replaceAll('_', ' '));
    }
  });

  it('requires a cancellation reason before submitting a cancellation', () => {
    const booking = component.bookings[0];
    component.openCancellationModal(booking);

    component.confirmCancellation('   ');
    expect(component.cancellationError).toBeTruthy();
    expect(component.selectedBookingForCancellation).toBe(booking);
  });
});
