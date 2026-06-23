import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyScheduleComponent } from './my-schedule.component';

describe('MyScheduleComponent', () => {
  let component: MyScheduleComponent;
  let fixture: ComponentFixture<MyScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render a day cell when rowspan from earlier hour still occupies the slot', () => {
    component.scheduleItems = [
      { id: 1, name: 'Lab', day: 'Jueves', startHour: 9, duration: 2, room: 'Lab 3', type: 'lab' },
      { id: 'APT-1', name: 'Tutoría', day: 'Jueves', startHour: 10, duration: 1, room: 'Sala', type: 'appointment', teacher: 'Prof. Test' }
    ];

    expect(component.shouldRenderDayCell('Jueves', '10:00')).toBeFalse();
    expect(component.getClassForSlot('Jueves', '10:00')?.type).toBe('appointment');
  });

  it('should render a day cell at the start hour of an appointment', () => {
    component.scheduleItems = [
      { id: 'APT-1', name: 'Tutoría', day: 'Viernes', startHour: 15, duration: 1, room: 'Sala', type: 'appointment', teacher: 'Prof. Test' }
    ];

    expect(component.shouldRenderDayCell('Viernes', '15:00')).toBeTrue();
    expect(component.getClassForSlot('Viernes', '15:00')?.type).toBe('appointment');
  });
});
