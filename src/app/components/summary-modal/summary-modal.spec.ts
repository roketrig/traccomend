import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryModal } from './summary-modal';

describe('SummaryModal', () => {
  let component: SummaryModal;
  let fixture: ComponentFixture<SummaryModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
