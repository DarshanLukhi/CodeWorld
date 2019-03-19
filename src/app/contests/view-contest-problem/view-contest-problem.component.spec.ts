import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContestProblemComponent } from './view-contest-problem.component';

describe('ViewContestProblemComponent', () => {
  let component: ViewContestProblemComponent;
  let fixture: ComponentFixture<ViewContestProblemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewContestProblemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewContestProblemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
