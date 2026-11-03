import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { MyBookings } from './my-bookings';

describe('MyBookings', () => {
  let component: MyBookings;
  let fixture: ComponentFixture<MyBookings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyBookings],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            data: {
              preload: {
                bookings: [
                  {
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
                ],
              },
            },
          },
        },
      }],
    }).compileComponents();

    fixture = TestBed.createComponent(MyBookings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use bookings from route data and normalize their start dates', () => {
    expect(component.bookings).toHaveLength(3);
    expect(component.bookings[0].pets).toBe('Milo');
    expect(component.bookings[0].startDate).toEqual(new Date('2026-10-28T09:00:00'));
    expect(component.bookings[2].startDate).toEqual(new Date(2026, 10, 20));
  });

  it('should display the start date as an hour in the calendar', () => {
    component.currentDate = new Date(2026, 9, 28);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.month-event strong')?.textContent.trim()).toBe('09:00');
  });

  it('should count bookings in the selected week', () => {
    component.currentDate = new Date(2026, 9, 29);

    expect(component.bookingsThisWeek).toBe(1);
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
