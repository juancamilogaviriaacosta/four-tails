import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../utils/loading-service';
import { Utils } from '../utils/utils';
import { FindSitterSearchForm, PetOption, ServiceOption, SitterSearchFilters } from './find-sitter-search-form';

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
  kindOfPets: PetOption[] = [];
  services: ServiceOption[] = [];

  constructor(private router: Router, public loadingService: LoadingService, private ar: ActivatedRoute) {
    this.kindOfPets = this.ar.snapshot.data['preload'].kindOfPets.map((pet: PetOption) => ({
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
    this.loadingService.show();
    setTimeout(() => {
      this.router.navigate(['/search-sitters'], {
        queryParams: {
          pets: JSON.stringify(filters.pets),
          address: filters.address,
          service: filters.service,
          startDate: filters.startDate,
          endDate: filters.endDate,
        },
      });
      this.loadingService.hide();
    }, 1000);
  }
}
