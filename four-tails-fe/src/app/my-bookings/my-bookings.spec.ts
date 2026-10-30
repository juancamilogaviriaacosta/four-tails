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
                    date: '2026-10-28',
                    time: '09:00',
                    pet: 'Milo',
                    service: 'Dog walking',
                    owner: 'Sophie L.',
                    color: 'blue',
                  },
                  {
                    date: '2026-11-02',
                    time: '11:30',
                    pet: 'Luna',
                    service: 'Day care',
                    owner: 'James R.',
                    color: 'yellow',
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

  it('should use bookings from route data and normalize date-only values', () => {
    expect(component.bookings).toHaveLength(2);
    expect(component.bookings[0].pet).toBe('Milo');
    expect(component.bookings[0].date).toEqual(new Date(2026, 9, 28));
  });

  it('should count bookings in the selected week', () => {
    component.currentDate = new Date(2026, 9, 29);

    expect(component.bookingsThisWeek).toBe(1);
  });
});
