import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search-sitters',
  imports: [FormsModule],
  templateUrl: './search-sitters.html',
  styleUrl: './search-sitters.css',
})
export class SearchSitters {
  searchModalOpen = false;
  search = {
    pets: '',
    address: '',
    service: '',
    startDate: '',
    endDate: '',
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.search.pets = this.route.snapshot.queryParamMap.get('pets') ?? '';
    this.search.address = this.route.snapshot.queryParamMap.get('address') ?? '';
    this.search.service = this.route.snapshot.queryParamMap.get('service') ?? '';
    this.search.startDate = this.route.snapshot.queryParamMap.get('startDate') ?? '';
    this.search.endDate = this.route.snapshot.queryParamMap.get('endDate') ?? '';
  }

  openSearchModal(): void {
    this.searchModalOpen = true;
  }

  closeSearchModal(): void {
    this.searchModalOpen = false;
  }

  applySearch(): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.search,
    });
    this.closeSearchModal();
  }

  readonly sitters = [
    {
      name: 'Maya Watson',
      image: 'https://img.magnific.com/foto-gratis/joven-bella-mujer-caminando-su-perro-parque_1301-3557.jpg',
      description: 'Calm, attentive care for dogs who love a little extra company.',
      address: 'Williamsburg, Brooklyn, NY',
      rating: '4.98',
      reviews: 42,
      fare: 35,
    },
    {
      name: 'Liam Parker',
      image: 'bs1.png',
      description: 'Experienced with energetic pups, long walks, and relaxed evenings.',
      address: 'Astoria, Queens, NY',
      rating: '4.95',
      reviews: 31,
      fare: 28,
    },
    {
      name: 'Jenny Anderson',
      image: 'fs1.png',
      description: 'Calm, attentive care for dogs who love a little extra company.',
      address: 'Williamsburg, Brooklyn, NY',
      rating: '4.98',
      reviews: 42,
      fare: 35,
    },
    {
      name: 'Martin Dawson',
      image: 'https://img.magnific.com/foto-gratis/retrato-joven-atractivo-caminando-calle-mochila-sobre-hombros-concepto-urbano_58466-11938.jpg',
      description: 'Experienced with energetic pups, long walks, and relaxed evenings.',
      address: 'Astoria, Queens, NY',
      rating: '4.95',
      reviews: 31,
      fare: 28,
    },
    {
      name: 'Sarah Chen',
      image: 'https://img.magnific.com/foto-gratis/mujer-asiatica-paseando-su-perro-husky-al-aire-libre_23-2150764844.jpg',
      description: 'Calm, attentive care for dogs who love a little extra company.',
      address: 'Williamsburg, Brooklyn, NY',
      rating: '4.98',
      reviews: 42,
      fare: 35,
    },
    {
      name: 'Lilian Alper',
      image: 'https://img.magnific.com/foto-gratis/persona-que-trabaja-casa-perro-mascota_23-2149104714.jpg',
      description: 'Experienced with energetic pups, long walks, and relaxed evenings.',
      address: 'Astoria, Queens, NY',
      rating: '4.95',
      reviews: 31,
      fare: 28,
    },
  ];
}
