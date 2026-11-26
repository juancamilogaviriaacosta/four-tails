import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AddressAutocompleteService } from '../find-sitter/address-autocomplete.service';
import { ApiUrlService } from '../utils/api-url.service';

import { EditSitterProfile } from './edit-sitter-profile';

describe('EditSitterProfile', () => {
  let component: EditSitterProfile;
  let fixture: ComponentFixture<EditSitterProfile>;
  let postRequest: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    postRequest = vi.fn().mockReturnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [EditSitterProfile],
      providers: [
        {
          provide: HttpClient,
          useValue: { post: postRequest },
        },
        {
          provide: ApiUrlService,
          useValue: { apiUrl: 'https://api.example.test' },
        },
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
                  staticData: {
                    services: [{ id: 1, name: 'Dog walking', pricingUnit: 'PER_DAY' }],
                  },
                  provider: {
                    serviceFees: [
                      {
                        amount: 66,
                        currency: 'AUD',
                        pricingUnit: 'PER_NIGHT',
                        serviceId: 1,
                        serviceName: 'Hosting',
                      },
                      {
                        amount: 77,
                        currency: 'AUD',
                        pricingUnit: 'PER_DAY',
                        serviceId: 2,
                        serviceName: 'Daycare',
                      },
                    ],
                  },
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

  it('maps provider service fees to the service rate model', () => {
    expect(component.availableServices).toEqual([{ id: 1, name: 'Dog walking', pricingUnit: 'PER_DAY' }]);
    expect(component.services).toEqual([
      { id: 1, name: 'Hosting', pricingUnit: 'PER_NIGHT', amount: 66 },
      { id: 2, name: 'Daycare', pricingUnit: 'PER_DAY', amount: 77 },
    ]);
  });

  it('adds a service only once and can remove it', () => {
    component.selectedServiceId = 1;
    component.addService();
    expect(component.services).toEqual([
      { id: 1, name: 'Dog walking', pricingUnit: 'PER_DAY', amount: null },
    ]);

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

  it('sends service fees, address, radius, and selected coordinates', () => {
    component.services = [{
      id: 1,
      name: 'Dog walking',
      pricingUnit: 'PER_DAY',
      amount: 25,
    }];
    component.address = '123 Main Street';
    component.coverageRadius = 12;
    component.latitude = 10;
    component.longitude = -20;

    component.setSitterProfile();

    expect(postRequest).toHaveBeenCalledWith('https://api.example.test/api/setSitterProfile', {
      serviceFees: [{
        serviceId: 1,
        serviceName: 'Dog walking',
        amount: 25,
        currency: 'AUD',
        pricingUnit: 'PER_DAY',
      }],
      address: '123 Main Street',
      coverageRadius: 12,
      latitude: 10,
      longitude: -20,
    });
    expect(component.saveSuccess).toBe('Sitter profile request sent.');
  });
});
