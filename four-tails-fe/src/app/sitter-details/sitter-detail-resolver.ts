import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiUrlService } from '../utils/api-url.service';

export const sitterDetailResolver: ResolveFn<any> = (route, state) => {
    const http = inject(HttpClient);
    const apiUrl = inject(ApiUrlService);
    const id = route.paramMap.get('id') ?? '';
    return forkJoin({
        sitter: http.get(`${apiUrl.apiUrl}/api/getProvider/` + id, { responseType: 'json'}),
    });
};