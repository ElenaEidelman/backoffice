import { TestBed } from '@angular/core/testing';

import { FormTitlesService } from './languages.service';

describe('FormTitlesService', () => {
  let service: FormTitlesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormTitlesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
