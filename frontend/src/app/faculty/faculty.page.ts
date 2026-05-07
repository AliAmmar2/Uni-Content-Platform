import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { select, Store } from '@ngrx/store';
import { selectAllFaculties } from './+state/courses.selector';
import { Router } from '@angular/router';
import { FacultyActions } from './+state/faculty.action';
import { LetDirective } from '@ngrx/component';
import { FACULTY_KEY } from './+state/faculty.reducer';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, LetDirective],
  templateUrl: './faculty.page.html',
  styleUrl: './faculty.page.scss'
})
export class FacultyPage implements OnInit {
  protected store = inject(Store);
  accessToken: string | null = null;
  private router = inject(Router);

  protected facultiesListSelected$ = this.store.pipe(select(selectAllFaculties));

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.accessToken = localStorage.getItem('accessToken');
      this.store.dispatch(FacultyActions.loadFaculties());
      if (!this.accessToken) {
        void this.router.navigate(['/login']);
      } else {
        console.log(localStorage.getItem('accessToken'));
      }
    }
  }

  faculties = [{
    name: 'Computer Science',
    code: 'CS',
    description: 'Computer Science is the study of the theory, algorithms, and applications of computer systems.'
  }]
  protected readonly FACULTY_KEY = FACULTY_KEY;
}
