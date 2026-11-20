import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiUrlService } from './api-url.service';
import { StaticDataCache } from './static-data-cache';
import type { StaticData } from './static-data-cache';

describe('StaticDataCache', () => {
  let cache: StaticDataCache;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ApiUrlService, useValue: { apiUrl: 'https://api.example.test' } },
      ],
    });

    cache = TestBed.inject(StaticDataCache);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('shares in-flight requests and reuses loaded data', () => {
    const results: StaticData[] = [];
    cache.load().subscribe(data => results.push(data));
    cache.load().subscribe(data => results.push(data));

    httpTestingController.expectOne('https://api.example.test/api/getKindOfPets')
      .flush([{ id: 1, name: 'Dog' }]);
    httpTestingController.expectOne('https://api.example.test/api/getServices')
      .flush([{ id: 1, name: 'Walking' }]);

    expect(results).toHaveLength(2);
    expect(cache.kindOfPets).toEqual([{ id: 1, name: 'Dog' }]);
    expect(cache.services).toEqual([{ id: 1, name: 'Walking' }]);

    cache.load().subscribe(data => results.push(data));

    expect(results).toHaveLength(3);
    httpTestingController.expectNone('https://api.example.test/api/getKindOfPets');
    httpTestingController.expectNone('https://api.example.test/api/getServices');
  });
});
