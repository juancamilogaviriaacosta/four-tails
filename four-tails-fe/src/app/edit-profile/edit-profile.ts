import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile {
  saved = false;

  profile = {
    profilePicture: '21-profile.png',
    firstName: 'Maya',
    lastName: 'Watson',
    dateOfBirth: '',
    email: 'maya.watson@example.com',
    phone: '',
    address: '',
  };

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.profile.profilePicture = String(reader.result ?? this.profile.profilePicture);
    };
    reader.readAsDataURL(file);
  }

  saveProfile(): void {
    this.saved = true;
  }
}
