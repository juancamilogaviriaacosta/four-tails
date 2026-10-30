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
    expect(component.bookings).toHaveLength(2);
    expect(component.bookings[0].pets).toBe('Milo');
    expect(component.bookings[0].startDate).toEqual(new Date('2026-10-28T09:00:00'));
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
});
