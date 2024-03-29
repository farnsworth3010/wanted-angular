import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { wantedInterceptor } from './core/interceptors/wanted-interceptor';
import { initializeApplication } from './core/utils/initializer';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    {
        provide: APP_INITIALIZER,
        useFactory: initializeApplication,
        multi: true,
    },
    provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
    })),
    provideAnimations(),
    provideHttpClient(withInterceptors([wantedInterceptor])),
    importProvidersFrom(AngularFireModule.initializeApp(environment.firebase)),
    importProvidersFrom([
        provideAnalytics(() => getAnalytics()),
        provideAuth(() => getAuth()),
        provideFunctions(() => getFunctions()),
        providePerformance(() => getPerformance()),
        provideStorage(() => getStorage()),
    ]),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })
],
};
