import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiUrlService {

  private readonly STORAGE_KEY = '4tails_api_url';

  get baseUrl(): string {
    const savedUrl = localStorage.getItem(this.STORAGE_KEY);
    return (savedUrl || environment.apiUrl).replace(/\/+$/, '');
  }

  get apiUrl(): string {
    return `${this.baseUrl}`;
  }

  setUrl(url: string): void {
    localStorage.setItem(
      this.STORAGE_KEY,
      url.trim().replace(/\/+$/, '')
    );
  }

  reset(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}