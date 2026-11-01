import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../utils/auth-service';

export const editProfileResolver: ResolveFn<any> = (route, state) => {
  const http = inject(HttpClient);
  const auth = inject(AuthService);
  return forkJoin({
    profile: http.get(`/api/getProfile/${auth.getUserId()}`, { responseType: 'json'}),
  });
};