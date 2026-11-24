import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Geolocation } from '@capacitor/geolocation';
import type { KindOfPet, ServiceOption } from '../utils/static-data-cache';

import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError
} from 'rxjs/operators';

import {
  AddressAutocompleteService,
  AddressSuggestion
} from './address-autocomplete.service';

export interface SitterSearchFilters {
  pets: { id: number | string; quantity: number }[];
  address: string;
  service: string;
  startDate: string;
  endDate: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
}

@Component({
  selector: 'app-find-sitter-search-form',
  imports: [FormsModule],
  templateUrl: './find-sitter-search-form.html',
  styleUrl: './find-sitter-search-form.css',
})
export class FindSitterSearchForm {
  @Input() kindOfPets: KindOfPet[] = [];
  @Input() services: ServiceOption[] = [];
  @Input() address = '';
  @Input() service = '';
  @Input() startDate = '';
  @Input() endDate = '';
  @Output() search = new EventEmitter<SitterSearchFilters>();

  petModalOpen = false;
  gettingLocation = false;
  locationError = '';

  latitude: number | null = null;
  longitude: number | null = null;
  radius = 30;

  private addressAutocompleteService = inject(AddressAutocompleteService);
  private destroyRef = inject(DestroyRef);
  private addressQuery$ = new Subject<string>();
  addressSuggestions: AddressSuggestion[] = [];
  searchingAddresses = false;

  constructor(public cdr: ChangeDetectorRef) {
    this.addressQuery$.pipe(debounceTime(300), distinctUntilChanged(), switchMap(query => {
      if (query.length < 3) {
        this.searchingAddresses = false;
        this.cdr.markForCheck();
        return of([]);
      }
      this.searchingAddresses = true;
      this.cdr.markForCheck();
      return this.addressAutocompleteService.search(query).pipe(catchError(error => {
        console.error('Address autocomplete error:', error);
        return of([]);
      }));
    }), takeUntilDestroyed(this.destroyRef)).subscribe(results => {
      this.addressSuggestions = results;
      this.searchingAddresses = false;
      this.cdr.markForCheck();
    });
  }

  get selectedPetSummary(): string {
    return this.kindOfPets
      .filter(pet => pet.quantity > 0)
      .map(pet => `${pet.name}: ${pet.quantity}`)
      .join(', ');
  }

  openPetModal(): void {
    this.petModalOpen = true;
  }

  closePetModal(): void {
    this.petModalOpen = false;
  }

  changePetQuantity(petName: string, change: number): void {
    const pet = this.kindOfPets.find(item => item.name === petName);
    if (pet) {
      pet.quantity = Math.max(0, pet.quantity + change);
    }
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

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.search.emit({
      pets: this.kindOfPets
        .filter(pet => pet.quantity > 0)
        .map(pet => ({ id: pet.id, quantity: pet.quantity })),
      address: this.address,
      service: this.service,
      startDate: this.startDate,
      endDate: this.endDate,
      ...(this.latitude !== null && this.longitude !== null
        ? {
          latitude: this.latitude,
          longitude: this.longitude,
          radius: this.radius,
        }
        : {}),
    });
  }
}
