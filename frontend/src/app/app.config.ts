import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

import { provideRouter } from '@angular/router';

import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';

/* STUDENT */
import { STUDENT_KEY, studentReducers } from './student/+state/student.reducer';

import { STUDENT_DETAILS_KEY, studentDetailsReducers } from './student/+state/student-details.reducer';

import { StudentEffect } from './student/+state/student.effect';

import { FACULTY_KEY, facultyReducers } from './faculty/+state/faculty.reducer';

import { FACULTY_DETAILS_KEY, facultyDetailsReducers } from './faculty/+state/faculty-details.reducer';

import { FacultyEffect } from './faculty/+state/faculty.effect';

import { MAJOR_KEY, majorReducers } from './major/+state/major.reducer';

import { MAJOR_DETAILS_KEY, majorDetailsReducers } from './major/+state/major-details.reducer';

import { MajorEffects } from './major/+state/major.effect';

import { COURSE_KEY, coursesReducers } from './courses/+state/course.reducer';

import { COURSE_DETAILS_KEY, courseDetailsReducers } from './courses/+state/course-details.reducer';

import { CourseEffects } from './courses/+state/courses.effect';

import { ADMIN_KEY, adminReducer } from './portal-admin/+state/admin.reducer';

import { ADMIN_DETAILS_KEY, adminDetailsReducers } from './portal-admin/+state/admin-details.reducer';

import { AdminEffects } from './portal-admin/+state/admin.effect';
import { provideToastr } from 'ngx-toastr';
import { MaterialEffect } from './material/+state/material.effect';
import { MATERIAL_KEY, materialReducers } from './material/+state/material.reducer';
import { MATERIAL_DETAILS_KEY, materialDetailsReducers } from './material/+state/material-details.reducer';

export function initializeFaIconLibrary(
  library: FaIconLibrary
) {
  return () => {
    library.addIconPacks(fas, far);
  };
}

export const bootstrapEffectList = [
  StudentEffect,
  CourseEffects,
  FacultyEffect,
  MajorEffects,
  AdminEffects,
  MaterialEffect
];

export const reducers = {

  [FACULTY_KEY]: facultyReducers,

  [FACULTY_DETAILS_KEY]: facultyDetailsReducers,

  [STUDENT_KEY]: studentReducers,

  [STUDENT_DETAILS_KEY]: studentDetailsReducers,

  [MAJOR_KEY]: majorReducers,

  [MAJOR_DETAILS_KEY]: majorDetailsReducers,

  [COURSE_KEY]: coursesReducers,

  [COURSE_DETAILS_KEY]: courseDetailsReducers,

  [ADMIN_KEY]: adminReducer,

  [ADMIN_DETAILS_KEY]: adminDetailsReducers,

  [MATERIAL_KEY]: materialReducers,

  [MATERIAL_DETAILS_KEY]: materialDetailsReducers,

};

export const appConfig: ApplicationConfig = {
  providers: [

    provideBrowserGlobalErrorListeners(),

    provideToastr({
      positionClass: 'toast-top-right',
      progressBar: true,
      closeButton: true,
      timeOut: 3000
    }),

    provideEffects(
      bootstrapEffectList
    ),

    provideStore(
      reducers
    ),

    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
      trace: false
    }),

    provideRouter(
      routes
    ),

    {
      provide: APP_INITIALIZER,
      useFactory: initializeFaIconLibrary,
      deps: [FaIconLibrary],
      multi: true
    }

  ]
};
