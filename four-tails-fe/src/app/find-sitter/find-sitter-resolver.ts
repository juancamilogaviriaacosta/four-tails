import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { StaticDataCache } from '../utils/static-data-cache';
import type { StaticData } from '../utils/static-data-cache';

export const findSitterResolver: ResolveFn<StaticData> = () => inject(StaticDataCache).load();