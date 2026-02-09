import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAuth0, authHttpInterceptorFn } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authHttpInterceptorFn])),
    provideAuth0({
      domain: 'dev-xsfw1aeu1c13w4pn.us.auth0.com',
      clientId: 'xjLYksWCVMnmBXJ1bK35fjJsK58TTnGp',
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: 'https://gator-club-life-api/',
      },
      httpInterceptor: {
        allowedList: [
          'http://localhost:8080/*',
          '/api/*'
        ]
      },
      cacheLocation: 'localstorage',
      useRefreshTokens: true
    }),
  ],
};