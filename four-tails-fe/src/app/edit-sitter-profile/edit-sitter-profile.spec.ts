import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AddressAutocompleteService } from '../find-sitter/address-autocomplete.service';

import { EditSitterProfile } from './edit-sitter-profile';

describe('EditSitterProfile', () => {
  let component: EditSitterProfile;
  let fixture: ComponentFixture<EditSitterProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSitterProfile],
      providers: [
        {
          provide: AddressAutocompleteService,
          useValue: { search: () => of([]) },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                preload: {
                  staticData: { services: [{ id: 1, name: 'Dog walking' }] },
                },
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditSitterProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads services from resolved static data', () => {
    expect(component.availableServices).toEqual([{ id: 1, name: 'Dog walking' }]);
    expect(component.services).toEqual([]);
  });

  it('adds a service only once and can remove it', () => {
    component.selectedServiceId = 1;
    component.addService();
    expect(component.services).toEqual([{ id: 1, name: 'Dog walking', amount: null }]);

    component.selectedServiceId = 1;
    component.addService();
    expect(component.services).toHaveLength(1);

    component.removeService(1);
    expect(component.services).toEqual([]);
  });

  it('sets the selected address and coordinates', () => {
    component.selectAddress({
      addressDetailPid: 'address-1',
      address: '123 Main Street',
      latitude: 10,
      longitude: -20,
    });

    expect(component.address).toBe('123 Main Street');
    expect(component.latitude).toBe(10);
    expect(component.longitude).toBe(-20);
    expect(component.addressSuggestions).toEqual([]);
  });
});
