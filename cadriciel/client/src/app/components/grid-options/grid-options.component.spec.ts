import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridOptionsComponent } from './grid-options.component';

describe('GridOptionsComponent', () => {
  let component: GridOptionsComponent;
  let fixture: ComponentFixture<GridOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
