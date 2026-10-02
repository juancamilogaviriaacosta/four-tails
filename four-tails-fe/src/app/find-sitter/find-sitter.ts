import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-find-sitter',
  imports: [FormsModule],
  templateUrl: './find-sitter.html',
  styleUrl: './find-sitter.css',
})
export class FindSitter {
  petModalOpen = false;

  readonly pets = [
    { name: 'Dog', quantity: 0 },
    { name: 'Cat', quantity: 0 },
    { name: 'Bird', quantity: 0 },
  ];

  constructor(private router: Router) {

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
    this.router.navigate(['/search-sitters'], {     
      queryParams: {
        pets: this.selectedPetSummary,
      },
    });
  }
}
