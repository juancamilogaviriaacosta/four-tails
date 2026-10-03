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
});
