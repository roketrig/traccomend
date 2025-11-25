import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAi } from './search-ai';

describe('SearchAi', () => {
  let component: SearchAi;
  let fixture: ComponentFixture<SearchAi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchAi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchAi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
