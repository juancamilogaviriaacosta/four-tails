import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { SearchSitters } from './search-sitters';

describe('SearchSitters', () => {
  let component: SearchSitters;
  let fixture: ComponentFixture<SearchSitters>;

  beforeEach(async () => {
    const preload = {
      sitters: [],
      kindOfPets: [{ id: 1, name: 'Dog', quantity: 0 }],
      services: [{ id: 'walking', name: 'Walking' }],
    };

    await TestBed.configureTestingModule({
      imports: [SearchSitters],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ preload }),
            snapshot: {
              data: { preload },
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
    expect(component.kindOfPets[0].quantity).toBe(2);
    expect(component.services).toEqual([{ id: 'walking', name: 'Walking' }]);
  });
});
