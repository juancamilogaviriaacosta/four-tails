import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-search-sitters',
  imports: [FormsModule, RouterLink],
  templateUrl: './search-sitters.html',
  styleUrl: './search-sitters.css',
})
export class SearchSitters {
  searchModalOpen = false;
  sitters;
  pets = '';
  address = '';
  service = '';
  startDate = '';
  endDate = '';

  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {
    this.sitters = this.route.snapshot.data['preload'].sitters;
    this.pets = this.route.snapshot.queryParamMap.get('pets') ?? '';
    this.address = this.route.snapshot.queryParamMap.get('address') ?? '';
    this.service = this.route.snapshot.queryParamMap.get('service') ?? '';
    this.startDate = this.route.snapshot.queryParamMap.get('startDate') ?? '';
    this.endDate = this.route.snapshot.queryParamMap.get('endDate') ?? '';
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
      //queryParams: this.search,
    });
    this.closeSearchModal();
  }
}