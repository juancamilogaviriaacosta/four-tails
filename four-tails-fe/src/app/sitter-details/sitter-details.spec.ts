import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { SitterDetails } from './sitter-details';

describe('SitterDetails', () => {
  let component: SitterDetails;
  let fixture: ComponentFixture<SitterDetails>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    localStorage.setItem('token', JSON.stringify({ id: 1 }));

    await TestBed.configureTestingModule({
      imports: [SitterDetails],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                preload: {
                  sitter: {
                    id: 17,
                    name: 'Maya Watson',
                    photos: [],
                  },
                },
              },
              queryParamMap: {
                get: () => null,
              },
            },
          },
        },
      ],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(SitterDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.removeItem('token');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens the confirmation and cancels without requesting a booking', () => {
    component.requestBooking();
    expect(component.bookingConfirmationOpen).toBe(true);

    component.cancelBooking();
    expect(component.bookingConfirmationOpen).toBe(false);
    expect(component.bookingRequested).toBe(false);
  });

  it('sends the booking details and confirms only after the API succeeds', () => {
    component.requestBooking();
    component.confirmBooking();

    const request = httpTestingController.expectOne('/api/confirmBooking');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      clientId: 1,
      providerId: 17,
      serviceId: '',
      startDate: `${component.startDate}T00:00:00Z`,
      endDate: `${component.endDate}T00:00:00Z`,
      fare: 150,
      notes: '',
    });
    expect(component.bookingRequested).toBe(false);

    request.flush({});

    expect(component.bookingConfirmationOpen).toBe(false);
    expect(component.bookingRequested).toBe(true);
  });
});
