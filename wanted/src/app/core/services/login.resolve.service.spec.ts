import { TestBed } from '@angular/core/testing';

import { LoginResolveService } from './login.resolve.service';

describe('LoginResolveService', () => {
  let service: LoginResolveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginResolveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
