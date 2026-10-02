import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSitters } from './search-sitters';

describe('SearchSitters', () => {
  let component: SearchSitters;
  let fixture: ComponentFixture<SearchSitters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchSitters],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchSitters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
