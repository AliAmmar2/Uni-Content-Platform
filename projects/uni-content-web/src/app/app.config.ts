import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { routes } from './app.routes';
import { StudentEffect } from './student/+state/student.effect';
import { STUDENT_DETAILS_KEY, studentDetailsReducers } from './student/+state/student.reducer';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

export function initializeFaIconLibrary(library: FaIconLibrary) {
  return () => {
    library.addIconPacks(fas, far);
  };
}

export const bootstrapEffectList = [
  StudentEffect
]

export const reducers = {
  [STUDENT_DETAILS_KEY]: studentDetailsReducers
}
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideEffects(bootstrapEffectList),
    provideStore(reducers),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeFaIconLibrary,
      deps: [FaIconLibrary],
      multi: true
    }
  ]
};
