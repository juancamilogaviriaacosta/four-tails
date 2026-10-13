import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitterDashboard } from './sitter-dashboard';

describe('SitterDashboard', () => {
  let component: SitterDashboard;
  let fixture: ComponentFixture<SitterDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SitterDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(SitterDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
