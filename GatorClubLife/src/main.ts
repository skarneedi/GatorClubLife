import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/home/home.component';
import { AboutComponent } from './app/about/about.component';
import { LoginComponent } from './app/login/login.component';
import { AdminComponent } from './app/admin/admin.component';
import { EventsComponent } from './app/events/events.component';
import { OrganizationsComponent } from './app/organizations/organizations.component';
import { PermitsComponent } from './app/permits/permits.component';

import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/auth.interceptor';
import { appConfig } from './app/app.config';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'about', component: AboutComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'events', component: EventsComponent },
  { path: 'organizations', component: OrganizationsComponent },
  { path: 'permits', component: PermitsComponent }
];

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor]))
  ]
})
.catch(err => console.error(err));
