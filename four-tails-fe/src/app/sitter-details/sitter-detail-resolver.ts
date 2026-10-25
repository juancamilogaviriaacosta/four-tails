import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin } from 'rxjs';

export const sitterDetailResolver: ResolveFn<any> = (route, state) => {
    const http = inject(HttpClient);
    const id = route.paramMap.get('id') ?? '';
    return forkJoin({
        sitter: http.get('/api/getProvider/' + id, { responseType: 'json'}),
    });
};