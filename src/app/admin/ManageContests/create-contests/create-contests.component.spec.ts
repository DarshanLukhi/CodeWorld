import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateContestsComponent } from './create-contests.component';

describe('CreateContestsComponent', () => {
  let component: CreateContestsComponent;
  let fixture: ComponentFixture<CreateContestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateContestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateContestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
