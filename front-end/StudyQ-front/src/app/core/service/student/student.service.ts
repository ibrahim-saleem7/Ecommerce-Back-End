import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http : HttpClient) { }

  getStudents(): Observable <any> {
    return this.http.get('http://localhost:8070/api/v1/student');
  }
}
