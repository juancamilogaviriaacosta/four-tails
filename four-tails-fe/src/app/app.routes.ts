import { Routes } from '@angular/router';
import { MainServices } from './main-services/main-services';
import { Login } from './login/login';
import { FindSitter } from './find-sitter/find-sitter';
import { SearchSitters } from './search-sitters/search-sitters';
import { SitterDetails } from './sitter-details/sitter-details';
import { Messages } from './messages/messages';
import { EditProfile } from './edit-profile/edit-profile';

export const routes: Routes = [
    { path: '', component: MainServices  },
    { path: 'find-sitter', component: FindSitter },
    { path: 'search-sitters', component: SearchSitters },
    { path: 'sitter-details', component: SitterDetails },
    { path: 'messages', component: Messages },
    { path: 'edit-profile', component: EditProfile },
];
