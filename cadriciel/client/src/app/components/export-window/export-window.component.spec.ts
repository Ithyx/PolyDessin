import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportWindowComponent } from './export-window.component';

describe('ExportWindowComponent', () => {
  let component: ExportWindowComponent;
  let fixture: ComponentFixture<ExportWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
