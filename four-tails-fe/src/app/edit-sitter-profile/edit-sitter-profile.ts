import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import type { ServiceOption, StaticData } from '../utils/static-data-cache';
import { Subject, finalize, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
} from 'rxjs/operators';
import { AddressAutocompleteService } from '../find-sitter/address-autocomplete.service';
import type { AddressSuggestion } from '../find-sitter/address-autocomplete.service';
import { Geolocation } from '@capacitor/geolocation';
import { EnumConverterPipe } from '../utils/enum-converter.pipe';
import { ApiUrlService } from '../utils/api-url.service';

interface SitterServiceRate extends ServiceOption {
  amount: number | null;
}

interface ProviderServiceFee {
  amount: number;
  pricingUnit: string;
  serviceId: number | string;
  serviceName: string;
}

interface SitterProfilePayload {
  serviceFees: {
    serviceId: number | string;
    serviceName: string;
    amount: number;
    currency: 'AUD'
  }[];
  address: string;
  coverageRadius: number;
  latitude?: number;
  longitude?: number;
}

@Component({
  selector: 'app-edit-sitter-profile',
  imports: [FormsModule, EnumConverterPipe],
  templateUrl: './edit-sitter-profile.html',
  styleUrl: './edit-sitter-profile.css',
})
export class EditSitterProfile {
  availableServices: ServiceOption[] = [];
  services: SitterServiceRate[] = [];
  selectedServiceId: number | string | null = null;
  address = '';
  coverageRadius = 30;
  locationError = '';
  saveError = '';
  saveSuccess = '';
  saving = false;
  latitude: number | null = null;
  longitude: number | null = null;
  private readonly addressQuery$ = new Subject<string>();
  addressSuggestions: AddressSuggestion[] = [];
  gettingLocation = false;
  searchingAddresses = false;

  private readonly addressAutocompleteService = inject(AddressAutocompleteService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(ApiUrlService);

  constructor(private readonly route: ActivatedRoute, public cdr: ChangeDetectorRef) {
    const provider = this.route.snapshot.data['preload'].provider;
    const staticData: StaticData = this.route.snapshot.data['preload'].staticData;
    this.availableServices = staticData.services;
    
    if(provider.id) {
      this.address = provider.address;
      this.services = provider.serviceFees.map((serviceFee: { serviceId: any; serviceName: any; pricingUnit: any; amount: any; }) => ({
        id: serviceFee.serviceId,
        name: serviceFee.serviceName,
        pricingUnit: serviceFee.pricingUnit,
        amount: serviceFee.amount,
      }));
    }

    this.addressQuery$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query) => {
        if (query.length < 3) {
          this.searchingAddresses = false;
          this.cdr.markForCheck();
          return of([]);
        }

        this.searchingAddresses = true;
        this.cdr.markForCheck();
        return this.addressAutocompleteService.search(query).pipe(
          catchError((error: unknown) => {
            console.error('Address autocomplete error:', error);
            return of([]);
          }),
        );
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((results) => {
      this.addressSuggestions = results;
      this.searchingAddresses = false;
      this.cdr.markForCheck();
    });
  }

  get selectedServiceAlreadyAdded(): boolean {
    return this.services.some((service) => service.id === this.selectedServiceId);
  }

  addService(): void {
    if (this.selectedServiceId === null || this.selectedServiceAlreadyAdded) {
      return;
    }

    const service = this.availableServices.find((option) => option.id === this.selectedServiceId);
    if (!service) {
      return;
    }

    this.services = [...this.services, { ...service, amount: null }];
    this.selectedServiceId = null;
  }

  removeService(serviceId: number | string): void {
    this.services = this.services.filter((service) => service.id !== serviceId);
  }

  clearCoordinates(): void {
    this.latitude = null;
    this.longitude = null;
    this.locationError = '';
  }

  onAddressChange(value: string): void {
    this.clearCoordinates();
    this.addressSuggestions = [];
    this.addressQuery$.next(value.trim());
  }

  selectAddress(suggestion: AddressSuggestion): void {
    this.address = suggestion.address;
    this.latitude = suggestion.latitude;
    this.longitude = suggestion.longitude;
    this.addressSuggestions = [];
    this.locationError = '';
  }

  async useMyLocation(): Promise<void> {
    this.gettingLocation = true;
    this.locationError = '';

    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      });

      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.address = '';

      // The GPS coordinates will be used instead of the typed address.
      this.address = 'Current location';
      this.addressSuggestions = [];
    } catch (error) {
      console.error('Unable to get current location:', error);
      this.locationError = 'Unable to get your location. Please check your location permissions.';
    } finally {
      this.cdr.markForCheck();
      this.gettingLocation = false;
    }
  }

  setSitterProfile(): void {
    this.saveError = '';
    this.saveSuccess = '';

    if (this.saving) {
      return;
    }

    if (this.services.length === 0) {
      this.saveError = 'Add at least one service before saving.';
      return;
    }

    const pricedServices = this.services.filter(
      (service): service is SitterServiceRate & { amount: number } =>
        service.amount !== null && Number.isFinite(service.amount) && service.amount >= 0,
    );
    if (pricedServices.length !== this.services.length) {
      this.saveError = 'Enter a valid rate for every service.';
      return;
    }

    const address = this.address.trim();
    if (!address) {
      this.saveError = 'Enter an address or use your current location.';
      return;
    }

    if (!Number.isFinite(this.coverageRadius) || this.coverageRadius < 1) {
      this.saveError = 'Enter a coverage radius of at least 1 km.';
      return;
    }

    const payload: SitterProfilePayload = {
      serviceFees: pricedServices.map((service) => ({
        serviceId: service.id,
        serviceName: service.name,
        amount: service.amount,
        currency: 'AUD'
      })),
      address,
      coverageRadius: this.coverageRadius,
      ...(this.latitude !== null && this.longitude !== null
        ? { latitude: this.latitude, longitude: this.longitude }
        : {}),
    };

    this.saving = true;
    this.http.post<unknown>(`${this.apiUrl.apiUrl}/api/setSitterProfile`, payload)
      .pipe(finalize(() => {
        this.saving = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: () => {
          this.saveSuccess = 'Sitter profile request sent.';
        },
        error: (error: unknown) => {
          console.error('Error saving sitter profile:', error);
          this.saveError = 'Could not save your sitter profile. Please try again.';
        },
      });
  }
}
