import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiUrlService } from '../utils/api-url.service';
import { StaticDataCache } from '../utils/static-data-cache';
import type { StaticData } from '../utils/static-data-cache';

export const editSitterProfileResolver: ResolveFn<any> = () => {
  const http = inject(HttpClient);
  const apiUrl = inject(ApiUrlService);
  const staticDataCache = inject(StaticDataCache);

  return forkJoin({
    staticData: staticDataCache.load(),
    provider: http.get(`${apiUrl.apiUrl}/api/getProvider`),
  });
};