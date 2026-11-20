import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

export interface PetOption {
  id: number | string;
  name: string;
  quantity: number;
}

export interface ServiceOption {
  id: number | string;
  name: string;
}

export interface SitterSearchFilters {
  pets: { id: number | string; quantity: number }[];
  address: string;
  service: string;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-find-sitter-search-form',
  imports: [FormsModule],
  templateUrl: './find-sitter-search-form.html',
  styleUrl: './find-sitter-search-form.css',
})
export class FindSitterSearchForm {
  @Input() kindOfPets: PetOption[] = [];
  @Input() services: ServiceOption[] = [];
  @Input() address = '';
  @Input() service = '';
  @Input() startDate = '';
  @Input() endDate = '';
  @Output() search = new EventEmitter<SitterSearchFilters>();

  petModalOpen = false;

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
    });
  }
}
