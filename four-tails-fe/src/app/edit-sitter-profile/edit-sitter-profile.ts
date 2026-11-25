import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import type { ServiceOption, StaticData } from '../utils/static-data-cache';
import { Subject } from 'rxjs';
import { AddressSuggestion } from '../find-sitter/address-autocomplete.service';
import { Geolocation } from '@capacitor/geolocation';

interface SitterServiceRate extends ServiceOption {
  amount: number | null;
  active: boolean;
}

@Component({
  selector: 'app-edit-sitter-profile',
  imports: [FormsModule],
  templateUrl: './edit-sitter-profile.html',
  styleUrl: './edit-sitter-profile.css',
})
export class EditSitterProfile {
  services: SitterServiceRate[] = [];
  address = '';
  coverageRadius = 30;
  locationError = '';
  latitude: number | null = null;
  longitude: number | null = null;
  radius = 30;
  addressQuery$ = new Subject<string>();
  addressSuggestions: AddressSuggestion[] = [];
  gettingLocation = false;

  constructor(private readonly route: ActivatedRoute, public cdr: ChangeDetectorRef) {
    const staticData: StaticData = this.route.snapshot.data['preload'].staticData;
    this.services = staticData.services.map((service) => ({ ...service, amount: null, active: false }));
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
