import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingsComponent } from './trainings.component';

describe('TrainingsComponent', () => {
  let component: TrainingsComponent;
  let fixture: ComponentFixture<TrainingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
