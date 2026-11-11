import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiUrlService } from '../utils/api-url.service';

export const findSitterResolver: ResolveFn<any> = (route, state) => {
  const http = inject(HttpClient);
  const apiUrl = inject(ApiUrlService);
  return forkJoin({
    kindOfPets: http.get(`${apiUrl.apiUrl}/api/getKindOfPets`, { responseType: 'json'}),
    services: http.get(`${apiUrl.apiUrl}/api/getServices`, { responseType: 'json' }),
  });
};