import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import type { ServiceOption, StaticData } from '../utils/static-data-cache';
import { Subject, of } from 'rxjs';
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

interface SitterServiceRate extends ServiceOption {
  amount: number | null;
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
  latitude: number | null = null;
  longitude: number | null = null;
  radius = 30;
  private readonly addressQuery$ = new Subject<string>();
  addressSuggestions: AddressSuggestion[] = [];
  gettingLocation = false;
  searchingAddresses = false;

  private readonly addressAutocompleteService = inject(AddressAutocompleteService);
  private readonly destroyRef = inject(DestroyRef);

  constructor(private readonly route: ActivatedRoute, public cdr: ChangeDetectorRef) {
    const staticData: StaticData = this.route.snapshot.data['preload'].staticData;
    this.availableServices = staticData.services;

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
}
