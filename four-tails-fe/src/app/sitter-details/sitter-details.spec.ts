import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitterDetails } from './sitter-details';

describe('SitterDetails', () => {
  let component: SitterDetails;
  let fixture: ComponentFixture<SitterDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SitterDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(SitterDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
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

  it('requests a booking only after confirmation', () => {
    component.requestBooking();
    component.confirmBooking();

    expect(component.bookingConfirmationOpen).toBe(false);
    expect(component.bookingRequested).toBe(true);
  });
});
