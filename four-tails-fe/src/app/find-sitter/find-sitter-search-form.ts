import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Geolocation } from '@capacitor/geolocation';
import type { KindOfPet, ServiceOption } from '../utils/static-data-cache';

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
  radius = 5;

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

    } catch (error) {
      console.error('Unable to get current location:', error);

      this.locationError =
        'Unable to get your location. Please check your location permissions.';
    } finally {
      this.gettingLocation = false;
    }
  }

  clearCoordinates(): void {
    this.latitude = null;
    this.longitude = null;
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
