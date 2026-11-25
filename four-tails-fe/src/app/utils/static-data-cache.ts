import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, finalize, forkJoin, of, shareReplay, tap } from 'rxjs';
import { ApiUrlService } from './api-url.service';

export interface KindOfPet {
  id: number | string;
  name: string;
  quantity: number;
}

export interface ServiceOption {
  id: number | string;
  name: string;
  pricingUnit: string;
}

export interface StaticData {
  kindOfPets: KindOfPet[];
  services: ServiceOption[];
}

@Injectable({ providedIn: 'root' })
export class StaticDataCache {
  kindOfPets: KindOfPet[] | null = null;
  services: ServiceOption[] | null = null;
  private loading$: Observable<StaticData> | null = null;

  constructor(private readonly http: HttpClient, private readonly apiUrl: ApiUrlService) {}

  load(): Observable<StaticData> {
    if (this.kindOfPets !== null && this.services !== null) {
      return of({ kindOfPets: this.kindOfPets, services: this.services });
    }

    if (this.loading$ !== null) {
      return this.loading$;
    }

    const request$ = forkJoin({
      kindOfPets: this.kindOfPets !== null
        ? of(this.kindOfPets)
        : this.http.get<KindOfPet[]>(`${this.apiUrl.apiUrl}/api/getKindOfPets`),
      services: this.services !== null
        ? of(this.services)
        : this.http.get<ServiceOption[]>(`${this.apiUrl.apiUrl}/api/getServices`),
    }).pipe(
      tap(data => {
        this.kindOfPets ??= data.kindOfPets;
        this.services ??= data.services;
      }),
      finalize(() => {
        this.loading$ = null;
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    this.loading$ = request$;
    return request$;
  }
}