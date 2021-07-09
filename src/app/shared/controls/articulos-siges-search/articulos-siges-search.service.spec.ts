import { TestBed, inject } from '@angular/core/testing';

import { ArticulosSigesSearchService } from './articulos-siges-search.service';

describe('ArticulosSigesSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArticulosSigesSearchService]
    });
  });

  it('should be created', inject([ArticulosSigesSearchService], (service: ArticulosSigesSearchService) => {
    expect(service).toBeTruthy();
  }));
});
