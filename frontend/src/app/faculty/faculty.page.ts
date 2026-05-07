import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './faculty.page.html',
  styleUrl: './faculty.page.scss'
})
export class FacultyPage {
  faculties = [{
    name: 'Computer Science',
    code: 'CS',
    description: 'Computer Science is the study of the theory, algorithms, and applications of computer systems.'
  }]
}
