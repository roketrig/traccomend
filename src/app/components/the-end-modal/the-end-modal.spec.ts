import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheEndModal } from './the-end-modal';

describe('TheEndModal', () => {
  let component: TheEndModal;
  let fixture: ComponentFixture<TheEndModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TheEndModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TheEndModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
