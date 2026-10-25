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

  constructor(private readonly route: ActivatedRoute, private readonly router: Router, private ar: ActivatedRoute) {
    this.sitters = this.ar.snapshot.data['preload'].sitters;
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