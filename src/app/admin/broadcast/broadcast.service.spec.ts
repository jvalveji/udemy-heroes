import { TestBed, inject } from '@angular/core/testing';

import { BroadcastService } from './broadcast.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BroadcastService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BroadcastService],
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', inject([BroadcastService], (service: BroadcastService) => {
    expect(service).toBeTruthy();
  }));
});
