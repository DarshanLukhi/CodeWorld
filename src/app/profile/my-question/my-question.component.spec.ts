import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyQuestionComponent } from './my-question.component';

describe('MyQuestionComponent', () => {
  let component: MyQuestionComponent;
  let fixture: ComponentFixture<MyQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
