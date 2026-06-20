import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationCenterComponent } from './reservation-center.component';

describe('ReservationCenterComponent', () => {
  let component: ReservationCenterComponent;
  let fixture: ComponentFixture<ReservationCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationCenterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
