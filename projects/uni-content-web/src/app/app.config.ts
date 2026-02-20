import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { StudentEffect } from './student/+state/student.effect';
import { STUDENT_DETAILS_KEY, studentDetailsReducers } from './student/+state/student.reducer';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';


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
    provideRouter(routes)
  ]
};
