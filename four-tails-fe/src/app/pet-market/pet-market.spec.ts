import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetMarket } from './pet-market';

describe('PetMarket', () => {
  let component: PetMarket;
  let fixture: ComponentFixture<PetMarket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetMarket],
    }).compileComponents();

    fixture = TestBed.createComponent(PetMarket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
