import { Component, OnInit } from '@angular/core';
import { Student } from '../student';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent implements OnInit {

  students: Student[] = [];

  formGroupStudent: FormGroup;
  isEditing: boolean = false;
  submited: boolean = false;


  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents() {

    this.service.getStudents().subscribe({
      next: data => this.students = data

    });

  }



  constructor(private formBuilder: FormBuilder,
    private service: StudentService
  ) {
    this.formGroupStudent = formBuilder.group({
      id: [''],
      name: ['', [Validators.minLength(3),Validators.required]],
      course: ['', [Validators.required]]

    });
  }


  save() {
     this.submited = true;
    if (this.formGroupStudent.valid) {
      if (this.isEditing) {
        this.service.update(this.formGroupStudent.value).subscribe({
          next: () => {
            this.loadStudents();
            this.isEditing = false;
            this.submited = false;

          }
        })
      }
      else {

        this.service.save(this.formGroupStudent.value).subscribe({

          next: data => {
            this.students.push(data);
            this.submited = false;
        }
      });
      }
      this.formGroupStudent.reset();
    }
  }
  delete(student: Student) {
    this.service.delete(student).subscribe({
      next: () => this.loadStudents()

    });

  }

  edit(student: Student) {
    this.formGroupStudent.setValue(student);
    this.isEditing = true;
  }

get name(): any {
  return this.formGroupStudent.get("name");
}

get course(): any {
  return this.formGroupStudent.get("course");
}

  
}

