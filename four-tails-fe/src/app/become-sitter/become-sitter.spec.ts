import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeSitter } from './become-sitter';

describe('BecomeSitter', () => {
  let component: BecomeSitter;
  let fixture: ComponentFixture<BecomeSitter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BecomeSitter],
    }).compileComponents();

    fixture = TestBed.createComponent(BecomeSitter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
