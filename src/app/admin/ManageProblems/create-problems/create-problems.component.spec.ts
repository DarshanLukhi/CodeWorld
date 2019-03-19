import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProblemsComponent } from './create-problems.component';

describe('CreateProblemsComponent', () => {
  let component: CreateProblemsComponent;
  let fixture: ComponentFixture<CreateProblemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateProblemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProblemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
