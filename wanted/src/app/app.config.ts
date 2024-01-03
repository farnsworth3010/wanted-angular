import { provideHttpClient } from "@angular/common/http";
import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { getAnalytics, provideAnalytics } from "@angular/fire/analytics";
import { getAuth, provideAuth } from "@angular/fire/auth";
import { AngularFireModule } from "@angular/fire/compat";
import { getFunctions, provideFunctions } from "@angular/fire/functions";
import { getPerformance, providePerformance } from "@angular/fire/performance";
import { getStorage, provideStorage } from "@angular/fire/storage";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { environment } from "../environments/environment";
import { routes } from "./app.routes";
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideHttpClient(),
    importProvidersFrom(AngularFireModule.initializeApp(environment.firebase)),
    importProvidersFrom([
      provideAnalytics(() => getAnalytics()),
      provideAuth(() => getAuth()),
      provideFunctions(() => getFunctions()),
      providePerformance(() => getPerformance()),
      provideStorage(() => getStorage()),
    ]),
  ],
};
