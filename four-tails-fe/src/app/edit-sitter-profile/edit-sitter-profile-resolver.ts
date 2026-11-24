import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../utils/auth-service';
import { ApiUrlService } from '../utils/api-url.service';

export const editSitterProfileResolver: ResolveFn<any> = (route, state) => {
  const http = inject(HttpClient);
  const apiUrl = inject(ApiUrlService);
  return forkJoin({
    profile: http.post(`${apiUrl.apiUrl}/api/setSitterProfile`, { responseType: 'json'}),
  });
};