import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventQustionWallComponent } from './event-qustion-wall.component';

describe('EventQustionWallComponent', () => {
  let component: EventQustionWallComponent;
  let fixture: ComponentFixture<EventQustionWallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventQustionWallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventQustionWallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
