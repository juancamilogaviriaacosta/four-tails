import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../utils/loading-service';
import { Utils } from '../utils/utils';
import { FindSitterSearchForm } from './find-sitter-search-form';
import type { SitterSearchFilters } from './find-sitter-search-form';
import type { KindOfPet, ServiceOption } from '../utils/static-data-cache';

@Component({
  selector: 'app-find-sitter',
  imports: [FindSitterSearchForm],
  templateUrl: './find-sitter.html',
  styleUrl: './find-sitter.css',
})
export class FindSitter {
  startDate = '';
  endDate = '';
  address = '';
  service = '';
  kindOfPets: KindOfPet[] = [];
  services: ServiceOption[] = [];

  constructor(private router: Router, public loadingService: LoadingService, private ar: ActivatedRoute) {
    this.kindOfPets = this.ar.snapshot.data['preload'].kindOfPets.map((pet: KindOfPet) => ({
      ...pet,
      quantity: pet.quantity ?? 0,
    }));
    this.services = this.ar.snapshot.data['preload'].services;

    const today = new Date();
    this.startDate = Utils.toDateInputValue(today);

    const checkout = new Date(today);
    checkout.setDate(checkout.getDate() + 4);
    this.endDate = Utils.toDateInputValue(checkout);

    this.address = 'Toowoomba QLD, Australia'
  }

  onSearch(filters: SitterSearchFilters): void {
    this.router.navigate(['/search-sitters'], {
      queryParams: {
        pets: JSON.stringify(filters.pets),
        address: filters.address,
        service: filters.service,
        startDate: filters.startDate,
        endDate: filters.endDate,
      },
    });
  }
}
