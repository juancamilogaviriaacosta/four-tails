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
  service = '';
  petModalOpen = false;
  kindOfPets:any = [];
  services:any = [];

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
    const selectedPets = this.kindOfPets.filter((pet:any) => pet.quantity > 0);
    return selectedPets.map((pet:any) => `${pet.name}: ${pet.quantity}`).join(', ');
  }

  openPetModal(): void {
    this.petModalOpen = true;
  }

  closePetModal(): void {
    this.petModalOpen = false;
  }

  changePetQuantity(petName: string, change: number): void {
    const pet:any = this.kindOfPets.find((item:any) => item.name === petName);
    if (pet) {
      pet.quantity = Math.max(0, pet.quantity + change);
    }
  }

  onSubmit(): void {
    this.loadingService.show();
    setTimeout(() => {
      const pets = this.kindOfPets.filter((pet: any) => pet.quantity > 0).map((pet: any) => ({ id: pet.id, quantity: pet.quantity }));
      this.router.navigate(['/search-sitters'], {
        queryParams: {
          pets: JSON.stringify(pets),
          address: this.address,
          service: this.service,
          startDate: this.startDate,
          endDate: this.endDate,
        },
      });
      this.loadingService.hide();
    }, 1000);
  }
}
