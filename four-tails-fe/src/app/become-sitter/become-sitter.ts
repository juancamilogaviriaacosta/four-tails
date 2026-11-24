import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-become-sitter',
  imports: [],
  templateUrl: './become-sitter.html',
  styleUrl: './become-sitter.css',
})
export class BecomeSitter {

  constructor(public router: Router) {
  }

  navigateToEditSitterProfile() {
    this.router.navigate(['/edit-sitter-profile']);
  }

}
