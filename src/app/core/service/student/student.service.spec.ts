import { TestBed } from '@angular/core/testing';

import { StudentService } from './../student/student.service';
import {provideHttpClient} from '@angular/common/http';

describe('LoginService', () => {
  let service: StudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
      ]
    });
    service = TestBed.inject(StudentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
