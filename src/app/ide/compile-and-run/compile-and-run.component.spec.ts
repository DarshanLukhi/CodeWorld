import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompileAndRunComponent } from './compile-and-run.component';

describe('CompileAndRunComponent', () => {
  let component: CompileAndRunComponent;
  let fixture: ComponentFixture<CompileAndRunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompileAndRunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompileAndRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
