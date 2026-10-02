import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindSitter } from './find-sitter';

describe('FindSitter', () => {
  let component: FindSitter;
  let fixture: ComponentFixture<FindSitter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindSitter],
    }).compileComponents();

    fixture = TestBed.createComponent(FindSitter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
