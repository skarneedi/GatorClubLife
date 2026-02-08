import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './auth.guard';
import { EventsComponent } from './events/events.component';
import { OrganizationsComponent } from './organizations/organizations.component';
import { OrganizationDetailsComponent } from './organization-details/organization-details.component';
import { PermitsComponent } from './permits/permits.component';
import { MySubmissionsComponent } from './my-submissions/my-submissions.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { EventsFormComponent } from './events-form/events-form.component';
import { EventDatesComponent } from './event-dates/event-dates.component';
import { AdditionalFormsComponent } from './additional-forms/additional-forms.component'; 
import { EventReviewComponent } from './event-review/event-review.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'about', component: AboutComponent, canActivate: [authGuard] },
  { path: 'contact', component: ContactComponent, canActivate: [authGuard] },
  { path: 'events', component: EventsComponent, canActivate: [authGuard] },
  { path: 'profile', component: MyProfileComponent, canActivate: [authGuard] },
  { path: 'my-events', component: MyEventsComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'organizations', component: OrganizationsComponent, canActivate: [authGuard] },
{ path: 'events', component: EventsComponent, canActivate: [authGuard] },
  {
    path: 'organizations',
    component: OrganizationsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'organizations/:id',
    component: OrganizationDetailsComponent,
    canActivate: [authGuard],
  },
  { path: 'permits', component: PermitsComponent, canActivate: [authGuard] },
  { path: 'my-submissions', component: MySubmissionsComponent, canActivate: [authGuard] },
  { path: 'my-profile', component: MyProfileComponent, canActivate: [authGuard] },
  { path: 'forms/:permitType', component: EventsFormComponent, canActivate: [authGuard] },
  { path: 'dates', component: EventDatesComponent, canActivate: [authGuard] },
  { path: 'additional-forms', component: AdditionalFormsComponent, canActivate: [authGuard] },
  { path: 'review', component: EventReviewComponent, canActivate: [authGuard] }
];
