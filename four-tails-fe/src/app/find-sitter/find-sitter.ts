import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../utils/loading-service';
import { Utils } from '../utils/utils';

@Component({
  selector: 'app-find-sitter',
  imports: [FormsModule],
  templateUrl: './find-sitter.html',
  styleUrl: './find-sitter.css',
})
export class FindSitter {
  startDate = '';
  endDate = '';
  address = '';
  petModalOpen = false;
  kindOfPets;
  services;

  readonly pets = [
    { name: 'Dog', quantity: 0 },
    { name: 'Cat', quantity: 0 },
    { name: 'Bird', quantity: 0 },
  ];

  constructor(private router: Router, public loadingService: LoadingService, private ar: ActivatedRoute) {
    this.kindOfPets = this.ar.snapshot.data['preload'].kindOfPets;
    this.services = this.ar.snapshot.data['preload'].services;

    const today = new Date();
    this.startDate = Utils.toDateInputValue(today);

    const checkout = new Date(today);
    checkout.setDate(checkout.getDate() + 4);
    this.endDate = Utils.toDateInputValue(checkout);

    this.address = 'Toowoomba QLD, Australia'
  }

  get selectedPetSummary(): string {
    const selectedPets = this.pets.filter((pet) => pet.quantity > 0);
    return selectedPets.map((pet) => `${pet.name}: ${pet.quantity}`).join(', ');
  }

  openPetModal(): void {
    this.petModalOpen = true;
  }

  closePetModal(): void {
    this.petModalOpen = false;
  }

  changePetQuantity(petName: string, change: number): void {
    const pet = this.pets.find((item) => item.name === petName);
    if (pet) {
      pet.quantity = Math.max(0, pet.quantity + change);
    }
  }

  onSubmit(): void {
    this.loadingService.show();
    setTimeout(() => {
      this.loadingService.hide();
      this.router.navigate(['/search-sitters'], { queryParams: { pets: this.selectedPetSummary } });
    }, 1000);
  }
}
