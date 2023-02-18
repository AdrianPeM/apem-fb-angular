import { TestBed } from '@angular/core/testing';

import { LoadingAppService } from './loading-app.service';

describe('LoadingAppService', () => {
  let service: LoadingAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
