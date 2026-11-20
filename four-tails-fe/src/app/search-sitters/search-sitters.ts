import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FindSitterSearchForm } from '../find-sitter/find-sitter-search-form';
import type { SitterSearchFilters } from '../find-sitter/find-sitter-search-form';
import type { KindOfPet, ServiceOption } from '../utils/static-data-cache';

interface SelectedPet {
  id: number | string;
  quantity: number;
}

function isSelectedPet(value: unknown): value is SelectedPet {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const pet = value as Record<string, unknown>;
  return (typeof pet['id'] === 'number' || typeof pet['id'] === 'string')
    && typeof pet['quantity'] === 'number';
}

@Component({
  selector: 'app-search-sitters',
  imports: [RouterLink, FindSitterSearchForm],
  templateUrl: './search-sitters.html',
  styleUrl: './search-sitters.css',
})
export class SearchSitters {
  searchModalOpen = false;
  sitters: any[] = [];
  kindOfPets: KindOfPet[] = [];
  services: ServiceOption[] = [];
  pets = '';
  address = '';
  service = '';
  startDate = '';
  endDate = '';

  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {
    this.pets = this.route.snapshot.queryParamMap.get('pets') ?? '';
    this.address = this.route.snapshot.queryParamMap.get('address') ?? '';
    this.service = this.route.snapshot.queryParamMap.get('service') ?? '';
    this.startDate = this.route.snapshot.queryParamMap.get('startDate') ?? '';
    this.endDate = this.route.snapshot.queryParamMap.get('endDate') ?? '';

    const preload = this.route.snapshot.data['preload'];
    const selectedPets = this.parseSelectedPets();
    this.kindOfPets = preload.kindOfPets.map((pet: KindOfPet) => ({
      ...pet,
      quantity: selectedPets.find(selected => String(selected.id) === String(pet.id))?.quantity ?? 0,
    }));
    this.services = preload.services;

    this.route.data.pipe(takeUntilDestroyed()).subscribe(data => {
      this.sitters = data['preload'].sitters;
    });
  }

  openSearchModal(): void {
    this.searchModalOpen = true;
  }

  closeSearchModal(): void {
    this.searchModalOpen = false;
  }

  private parseSelectedPets(): SelectedPet[] {
    if (!this.pets) {
      return [];
    }

    try {
      const selectedPets: unknown = JSON.parse(this.pets);
      if (!Array.isArray(selectedPets) || !selectedPets.every(isSelectedPet)) {
        throw new TypeError('Expected a list of selected pets');
      }
      return selectedPets;
    } catch (error) {
      console.error('Unable to parse pets from search query', error);
      return [];
    }
  }

  applySearch(filters: SitterSearchFilters): void {
    this.pets = JSON.stringify(filters.pets);
    this.address = filters.address;
    this.service = filters.service;
    this.startDate = filters.startDate;
    this.endDate = filters.endDate;

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        pets: this.pets,
        address: this.address,
        service: this.service,
        startDate: this.startDate,
        endDate: this.endDate,
      },
    });
    this.closeSearchModal();
  }
}