import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin } from 'rxjs';

export const findSitterResolver: ResolveFn<any> = (route, state) => {
  const http = inject(HttpClient);
  return forkJoin({
    kindOfPets: http.get('/api/getKindOfPets', { responseType: 'json'}),
    services: http.get('/api/getServices', { responseType: 'json' }),
  });
};