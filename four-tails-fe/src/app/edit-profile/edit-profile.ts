import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoadingService } from '../utils/loading-service';
import { AuthService } from '../utils/auth-service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ApiUrlService } from '../utils/api-url.service';

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
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    phone: '',
    address: '',
  };

  constructor(
    private loadingService: LoadingService, 
    private auth: AuthService, 
    private http: HttpClient, 
    private ar: ActivatedRoute, 
    private apiUrl: ApiUrlService) {
    this.profile = this.ar.snapshot.data['preload'].profile;
    if (!this.profile.profilePicture) {
      this.profile.profilePicture = '21-profile.png';
    }
  }

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

  setProfile(): void {
    this.http.post(`${this.apiUrl.apiUrl}/api/setProfile`, { id: this.auth.getUserId() , ...this.profile}).subscribe({
      next: (response:any) => {
        localStorage.setItem('token', response.token);
        this.saved = true;
        this.loadingService.hide();
      },
      error: (error) => {
        alert('Unexpected error');
        this.loadingService.hide();
      }
    });
  }
}
