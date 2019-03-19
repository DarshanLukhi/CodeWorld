import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContestComponent } from './view-contest.component';

describe('ViewContestComponent', () => {
  let component: ViewContestComponent;
  let fixture: ComponentFixture<ViewContestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewContestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewContestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
