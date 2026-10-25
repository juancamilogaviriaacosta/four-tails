import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin } from 'rxjs';

export const searchSittersResolver: ResolveFn<any> = (route, state) => {
    const http = inject(HttpClient);
    const params:any = {
        'pets' : route.queryParamMap.get('pets') ?? '',
        'address' : route.queryParamMap.get('address') ?? '',
        'service' : route.queryParamMap.get('service') ?? '',
        'startDate' : route.queryParamMap.get('startDate') ?? '',
        'endDate' : route.queryParamMap.get('endDate') ?? '',
    };

    return forkJoin({
        sitters: http.get('/api/getProviders', { params, responseType: 'json'}),
    });
};