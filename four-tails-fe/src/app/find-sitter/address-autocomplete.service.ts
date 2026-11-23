import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrlService } from '../utils/api-url.service';
import { Observable } from 'rxjs';

export interface AddressSuggestion {
  addressDetailPid: string;
  address: string;
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})
export class AddressAutocompleteService {

  private http = inject(HttpClient);
  private apiUrl = inject(ApiUrlService);

  search(query: string): Observable<AddressSuggestion[]> {
    return this.http.get<AddressSuggestion[]>(
      `${this.apiUrl.apiUrl}/api/getAddressSuggestions`,
      {
        params: { query }
      }
    );
  }
}