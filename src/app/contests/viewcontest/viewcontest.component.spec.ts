import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewcontestComponent } from './viewcontest.component';

describe('ViewcontestComponent', () => {
  let component: ViewcontestComponent;
  let fixture: ComponentFixture<ViewcontestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewcontestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewcontestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
