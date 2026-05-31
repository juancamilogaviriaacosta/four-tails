import { Routes } from '@angular/router';
import { MainServices } from './main-services/main-services';
import { Login } from './login/login';

export const routes: Routes = [
    { path: '', component: MainServices  },
    { path: 'login', component: Login}
];
