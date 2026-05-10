import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { routes } from './app.routes';
// import { StudentEffect } from './student/+state/student.effect';
import { STUDENT_DETAILS_KEY, studentDetailsReducers } from './student/+state/student-details.reducer';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { COURSE_DETAILS_KEY, courseDetailsReducers } from './courses/+state/course-details.reducer';
import { FacultyEffect } from './faculty/+state/faculty.effect';
import { FACULTY_KEY, facultyReducers } from './faculty/+state/faculty.reducer';
import { FACULTY_DETAILS_KEY, facultyDetailsReducers } from './faculty/+state/faculty-details.reducer';
import { STUDENT_KEY, studentReducers } from './student/+state/student.reducer';
import { StudentEffect } from './student/+state/student.effect';
import { MAJOR_DETAILS_KEY, majorDetailsReducers } from './major/+state/major-details.reducer';
import { MAJOR_KEY, majorReducers } from './major/+state/major.reducer';
import { MajorEffects } from './major/+state/major.effect';
import { COURSE_KEY, coursesReducers } from './courses/+state/course.reducer';
import { CourseEffects } from './courses/+state/courses.effect';

export function initializeFaIconLibrary(library: FaIconLibrary) {
  return () => {
    library.addIconPacks(fas, far);
  };
}

export const bootstrapEffectList = [
  StudentEffect,
  CourseEffects,
  FacultyEffect,
  MajorEffects
]

export const reducers = {
  [FACULTY_KEY]: facultyReducers,
  [STUDENT_KEY]: studentReducers,
  [MAJOR_DETAILS_KEY]: majorDetailsReducers,
  [MAJOR_KEY]: majorReducers,
  [COURSE_DETAILS_KEY]: courseDetailsReducers,
  [COURSE_KEY]: coursesReducers,
  [STUDENT_DETAILS_KEY]: studentDetailsReducers,
  [FACULTY_DETAILS_KEY]: facultyDetailsReducers,
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
