import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiceOption, StaticDataCache } from '../utils/static-data-cache';

interface SitterServiceRate extends ServiceOption {
  amount: number | null;
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
  servicesLoading = true;
  servicesError = '';

  constructor(staticDataCache: StaticDataCache) {
    staticDataCache.load().subscribe({
      next: ({ services }) => {
        this.services = services.map((service) => ({ ...service, amount: null }));
        this.servicesLoading = false;
      },
      error: (error: unknown) => {
        console.error('Error loading sitter profile services:', error);
        this.servicesError = 'No se pudieron cargar los servicios. Intenta de nuevo más tarde.';
        this.servicesLoading = false;
      },
    });
  }
}
