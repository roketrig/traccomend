import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Enter } from './enter';

describe('Enter', () => {
  let component: Enter;
  let fixture: ComponentFixture<Enter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Enter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Enter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
