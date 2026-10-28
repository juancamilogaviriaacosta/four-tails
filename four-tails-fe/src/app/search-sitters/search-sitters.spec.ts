import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { SearchSitters } from './search-sitters';

describe('SearchSitters', () => {
  let component: SearchSitters;
  let fixture: ComponentFixture<SearchSitters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchSitters],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: { preload: { sitters: [] } },
              queryParamMap: {
                get: (name: string) => ({
                  pets: '[{"id":1,"quantity":2}]',
                  address: 'Toowoomba',
                  service: 'walking',
                  startDate: '2026-10-27',
                  endDate: '2026-10-31',
                })[name] ?? null,
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchSitters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initializes the search fields from URL query parameters', () => {
    expect(component.pets).toBe('[{"id":1,"quantity":2}]');
    expect(component.address).toBe('Toowoomba');
    expect(component.service).toBe('walking');
    expect(component.startDate).toBe('2026-10-27');
    expect(component.endDate).toBe('2026-10-31');
  });
});
