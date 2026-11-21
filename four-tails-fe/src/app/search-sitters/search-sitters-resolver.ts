import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { finalize, forkJoin, map } from 'rxjs';
import { ApiUrlService } from '../utils/api-url.service';
import { StaticDataCache } from '../utils/static-data-cache';
import { LoadingService } from '../utils/loading-service';

export const searchSittersResolver: ResolveFn<any> = (route, state) => {
    const http = inject(HttpClient);
    const apiUrl = inject(ApiUrlService);
    const staticDataCache = inject(StaticDataCache);
    const loadingService = inject(LoadingService);
    const params: any = {
        'pets': route.queryParamMap.get('pets') ?? '',
        'address': route.queryParamMap.get('address') ?? '',
        'service': route.queryParamMap.get('service') ?? '',
        'startDate': route.queryParamMap.get('startDate') ?? '',
        'endDate': route.queryParamMap.get('endDate') ?? '',
    };
    loadingService.show();
    return forkJoin({
        sitters: http.get(`${apiUrl.apiUrl}/api/getProviders`, { params, responseType: 'json' }),
        staticData: staticDataCache.load(),
    }).pipe(
        map(({ sitters, staticData }) => ({ sitters, ...staticData })),
        finalize(() => loadingService.hide()),
    );
};