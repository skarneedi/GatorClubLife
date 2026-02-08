import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { AnnouncementsComponent } from './announcements/announcements.component'; // Adjust path if needed

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    AnnouncementsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
